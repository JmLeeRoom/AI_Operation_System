package service

import (
	"data-pipeline-backend/internal/config"
	"data-pipeline-backend/internal/models"
	"data-pipeline-backend/internal/repository"
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

// RUNNER_PY is the Python runner script embedded in KService containers
const RUNNER_PY = `import os, time, json, uuid, hashlib, importlib.util
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.request import Request, urlopen
from collections import OrderedDict

FLOW_ID  = os.environ.get("FLOW_ID","")
APP_ID   = os.environ.get("APP_ID","step")
IN_TYPES = [t.strip() for t in os.environ.get("IN_TYPES","").split(",") if t.strip()]
OUT_TYPE = os.environ.get("OUT_TYPE","").strip()
MAX_HOPS = int(os.environ.get("MAX_HOPS","5"))
DEDUPE_WINDOW = int(os.environ.get("DEDUPE_WINDOW_SEC","60"))
SINK = os.environ.get("K_SINK","")

def load_user():
    p="/code/user_code.py"
    spec = importlib.util.spec_from_file_location("user_code", p)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    if not hasattr(mod, "handle"): raise RuntimeError("user_code.handle not found")
    return mod.handle
USER_HANDLE = load_user()

seen = OrderedDict()
def dedupe(key):
    now = time.time()
    for k in list(seen.keys()):
        if now - seen[k][0] > DEDUPE_WINDOW: seen.pop(k, None)
        else: break
    if key in seen: return True
    seen[key] = (now,1)
    if len(seen) > 2048: seen.popitem(last=False)
    return False

def post_ce(url, obj, typ, trace_id=None, hops=0):
    if not url or not typ: return
    data = json.dumps(obj).encode("utf-8")
    hdr = {
      "Content-Type":"application/json",
      "Ce-Specversion":"1.0",
      "Ce-Type": typ,
      "Ce-Source": f"/flow/{FLOW_ID}/{APP_ID}",
      "Ce-Id": str(uuid.uuid4()),
      "Ce-Traceid": trace_id or str(uuid.uuid4()),
      "Ce-Hops": str(hops),
      "Ce-Producer": APP_ID,
    }
    urlopen(Request(url, data=data, headers=hdr), timeout=5).read()

class H(BaseHTTPRequestHandler):
    def do_GET(self): self.send_response(200); self.end_headers(); self.wfile.write(b"ok")
    def do_POST(self):
        n = int(self.headers.get("Content-Length","0") or "0")
        raw = self.rfile.read(n) if n>0 else b"{}"
        try: enveloped = json.loads(raw.decode())
        except: enveloped = {}
        evt = enveloped.get("data", enveloped if isinstance(enveloped, dict) else {})

        ctype    = self.headers.get("Ce-Type") or self.headers.get("ce-type") or ""
        trace_id = self.headers.get("Ce-Traceid") or self.headers.get("ce-traceid") or None
        hops     = int(self.headers.get("Ce-Hops") or self.headers.get("ce-hops") or "0")
        producer = self.headers.get("Ce-Producer") or self.headers.get("ce-producer") or ""
        ceid     = self.headers.get("Ce-Id") or self.headers.get("ce-id")
        if not ceid: ceid = hashlib.sha1(raw).hexdigest()
        if dedupe(ceid): self.send_response(204); self.end_headers(); return

        if hops >= MAX_HOPS: self.send_response(204); self.end_headers(); return
        if OUT_TYPE and ctype == OUT_TYPE: self.send_response(204); self.end_headers(); return
        if producer == APP_ID: self.send_response(204); self.end_headers(); return
        if IN_TYPES and ctype not in IN_TYPES: self.send_response(204); self.end_headers(); return

        try:
            out = USER_HANDLE(evt if isinstance(evt, dict) else {})
            outs = out if isinstance(out, list) else ([out] if out is not None else [])
            emitted = []  # 실제 발행된 ce_type들을 기록

            for item in outs:
                if not isinstance(item, dict): continue
                # 마지막 스텝이면 발행 금지 (OUT_TYPE이 비어 있음)
                ALLOW_EMIT = bool(OUT_TYPE)
                # 사용자 코드가 지정한 타입이 있으면 우선
                t = item.pop("__type", OUT_TYPE if ALLOW_EMIT else "")
                if ALLOW_EMIT and t and SINK:
                    try:
                        post_ce(SINK, item, t, trace_id=trace_id, hops=hops+1)
                        emitted.append(t)
                        print(f"[{APP_ID.upper()}] emit ce_type={t}", flush=True)  # 👈 검증용 로그
                    except Exception as e:
                        print(f"[{APP_ID.upper()}] emit error: {e}", flush=True)

            # 요약 로그 (in/out 가시화)
            out_types = ",".join(emitted) if emitted else (OUT_TYPE or "-")
            size = len(outs) if isinstance(outs, list) else (1 if out is not None else 0)
            print(f"[{APP_ID.upper()}] in={ctype} out={out_types} items={size}", flush=True)
        except Exception as e:
            print(f"[{APP_ID.upper()}] error: {e}", flush=True)

        self.send_response(204); self.end_headers()
    def log_message(self,*a): pass
HTTPServer(("0.0.0.0",8080), H).serve_forever()
`

// K8sService handles Kubernetes operations for flow deployment
type K8sService struct {
	clientset      *kubernetes.Clientset
	dynamicClient  dynamic.Interface
	objectRepo     *repository.ObjectRepository
	kafkaNamespace string
	kafkaCluster   string
	kafkaBootstrap string
	pyImage        string
}

// NewK8sService creates a new K8sService instance
func NewK8sService(objectRepo *repository.ObjectRepository) (*K8sService, error) {
	cfg := config.Get()

	var k8sConfig *rest.Config
	var err error

	if cfg.K8s.InCluster {
		// Server: in-cluster config
		k8sConfig, err = rest.InClusterConfig()
	} else {
		// Local: kubeconfig
		kubeconfigPath := cfg.K8s.KubeconfigPath
		if kubeconfigPath == "" {
			// Try default kubeconfig location
			home, _ := os.UserHomeDir()
			kubeconfigPath = filepath.Join(home, ".kube", "config")
		}

		loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
		loadingRules.ExplicitPath = kubeconfigPath

		configOverrides := &clientcmd.ConfigOverrides{}
		if cfg.K8s.Context != "" {
			configOverrides.CurrentContext = cfg.K8s.Context
		}

		k8sConfig, err = clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
			loadingRules, configOverrides).ClientConfig()
	}

	if err != nil {
		return nil, fmt.Errorf("failed to get k8s config: %w", err)
	}

	clientset, err := kubernetes.NewForConfig(k8sConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create clientset: %w", err)
	}

	dynamicClient, err := dynamic.NewForConfig(k8sConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create dynamic client: %w", err)
	}

	kafkaBootstrap := cfg.K8s.KafkaBootstrap
	if kafkaBootstrap == "" {
		kafkaBootstrap = fmt.Sprintf("%s-kafka-bootstrap.%s.svc.cluster.local:9092",
			cfg.K8s.KafkaCluster, cfg.K8s.KafkaNamespace)
	}

	return &K8sService{
		clientset:      clientset,
		dynamicClient:  dynamicClient,
		objectRepo:     objectRepo,
		kafkaNamespace: cfg.K8s.KafkaNamespace,
		kafkaCluster:   cfg.K8s.KafkaCluster,
		kafkaBootstrap: kafkaBootstrap,
		pyImage:        "ghcr.io/miribitsm3/python_image_build/python-pandas:1.0",
	}, nil
}

// PreflightResult represents the result of preflight check
type PreflightResult struct {
	OK     bool
	Detail string
}

// ProgressCallback is called during deployment to report progress
type ProgressCallback func(phase, message string, ok bool, extra map[string]interface{})

// Apply deploys a flow to Kubernetes
// Steps: Preflight → Topic → Sink → Source → KService → Kick Job → Log Verification
func (s *K8sService) Apply(ctx context.Context, dto *models.K8sRequestDTO, createNamespaceIfMissing, waitReady bool) (string, error) {
	steps, err := s.makeStep(dto.Steps)
	if err != nil {
		return "", fmt.Errorf("failed to make steps: %w", err)
	}

	if err := s.validateDTO(dto, steps); err != nil {
		return "", fmt.Errorf("validation failed: %w", err)
	}

	ns := "user-" + dto.User
	flowID := dto.FlowID

	// Ensure namespace exists
	if createNamespaceIfMissing {
		if err := s.ensureNamespace(ctx, ns); err != nil {
			return "", fmt.Errorf("failed to ensure namespace: %w", err)
		}
	}

	// 0) Preflight
	pre := s.preflightPipelineCheck(ctx, ns, flowID, steps, 20, 90)
	if !pre.OK {
		return "", fmt.Errorf("preflight failed: %s", pre.Detail)
	}

	// 1) KafkaTopic
	if err := s.createKafkaTopic(ctx, flowID); err != nil {
		return "", fmt.Errorf("createKafkaTopic failed: %w", err)
	}

	// 2) KafkaSink
	if err := s.createKafkaSink(ctx, ns, flowID); err != nil {
		return "", fmt.Errorf("createKafkaSink failed: %w", err)
	}

	aliveKsvcNames := make(map[string]bool)

	// 3) Steps — KSVC 생성
	i := 0
	for stepName, code := range steps {
		safeStepName := s.safeName(stepName)
		inType := s.getInType(flowID, i)
		outType := s.getOutType(flowID, i, len(steps))

		cmName := fmt.Sprintf("code-flow%s-%s", flowID, safeStepName)
		ksvcName := fmt.Sprintf("flow%s-%s", flowID, safeStepName)
		cg := fmt.Sprintf("cg-flow%s-%s-v1", flowID, safeStepName)
		codeHash := s.sha256(code)
		aliveKsvcNames[ksvcName] = true

		// 3-a) ConfigMap
		if err := s.createConfigMap(ctx, ns, cmName, flowID, code); err != nil {
			return "", fmt.Errorf("createOrReplace ConfigMap failed for step %s: %w", stepName, err)
		}

		// 3-b) Get maxScale from object params
		maxScale := 5
		if i < len(dto.Steps) {
			objectID := dto.Steps[i]
			obj, err := s.objectRepo.FindByID(objectID)
			if err == nil && len(obj.Params) > 0 {
				var params map[string]interface{}
				if err := json.Unmarshal(obj.Params, &params); err == nil {
					if as, ok := params["autoScale"]; ok && as != nil {
						var userMax *int
						switch v := as.(type) {
						case float64:
							iv := int(v)
							userMax = &iv
						case int:
							userMax = &v
						case map[string]interface{}:
							if mv, ok := v["maxScale"]; ok && mv != nil {
								switch mv2 := mv.(type) {
								case float64:
									iv := int(mv2)
									userMax = &iv
								case int:
									userMax = &mv2
								case string:
									if parsed, err := strconv.Atoi(strings.TrimSpace(mv2)); err == nil {
										userMax = &parsed
									}
								}
							}
						case string:
							if parsed, err := strconv.Atoi(strings.TrimSpace(v)); err == nil {
								userMax = &parsed
							}
						}
						if userMax != nil {
							// Clamp to [0..5] like Java
							effectiveMax := *userMax
							if effectiveMax < 0 {
								effectiveMax = 0
							}
							if effectiveMax > 5 {
								effectiveMax = 5
							}
							maxScale = effectiveMax
						}
					}
				}
			}
		}

		// 3-c) KSVC 생성/교체
		if err := s.createOrRecreateKsvc(ctx, ns, flowID, cmName, ksvcName, safeStepName, inType, outType, codeHash, maxScale); err != nil {
			return "", fmt.Errorf("createOrReplace KSVC failed for step %s: %w", stepName, err)
		}

		// 3-d) KafkaSource (sink = ref: KSVC)
		if err := s.createKafkaSourceToKSVC(ctx, ns, flowID, ksvcName, cg); err != nil {
			return "", fmt.Errorf("createKafkaSource (to KSVC) failed for step %s: %w", stepName, err)
		}

		if waitReady {
			if ok := s.waitKServiceReady(ctx, ns, ksvcName, 2*time.Minute); !ok {
				return "", fmt.Errorf("KSVC not Ready -> %s", ksvcName)
			}
		}
		i++
	}

	s.pruneStaleFlowSteps(ctx, ns, flowID, aliveKsvcNames)
	return fmt.Sprintf("flow %s applied (%d steps)", flowID, len(steps)), nil
}

// PrepareDeployedFlow checks if all resources are ready (without kick)
func (s *K8sService) PrepareDeployedFlow(ctx context.Context, dto *models.K8sRequestDTO, timeoutSeconds int) string {
	ns := "user-" + dto.User
	flowID := dto.FlowID
	kafkaSinkName := "sink-" + flowID

	steps, err := s.makeStep(dto.Steps)
	if err != nil {
		return fmt.Sprintf("NG: failed to make steps: %v", err)
	}
	if len(steps) == 0 {
		return "NG: steps is empty"
	}

	deadline := time.Now().Add(time.Duration(timeoutSeconds) * time.Second)

	// Check all KSVCs are ready
	for stepNameRaw := range steps {
		ksvc := fmt.Sprintf("flow%s-%s", flowID, s.safeName(stepNameRaw))
		timeout := time.Duration(timeoutSeconds/2) * time.Second
		if timeout < 5*time.Second {
			timeout = 5 * time.Second
		}
		if ok := s.waitKServiceReady(ctx, ns, ksvc, timeout); !ok {
			return fmt.Sprintf("NG: kservice not ready -> %s", ksvc)
		}
	}

	// Check KafkaSink is ready
	if !s.waitKafkaSinkReady(ctx, ns, kafkaSinkName, deadline) {
		return fmt.Sprintf("NG: KafkaSink not Ready -> %s", kafkaSinkName)
	}

	// Check all KafkaSources are ready
	for stepNameRaw := range steps {
		ksvcName := fmt.Sprintf("flow%s-%s", flowID, s.safeName(stepNameRaw))
		srcName := fmt.Sprintf("source-%s-to-%s", flowID, ksvcName)
		if !s.waitKafkaSourceReady(ctx, ns, srcName, deadline) {
			return fmt.Sprintf("NG: KafkaSource not Ready -> %s", srcName)
		}
	}

	return "OK: prepared"
}

// RunOnceAndVerify kicks the flow and verifies execution
func (s *K8sService) RunOnceAndVerify(ctx context.Context, dto *models.K8sRequestDTO, timeoutSeconds int) string {
	ns := "user-" + dto.User
	flowID := dto.FlowID

	steps, err := s.makeStep(dto.Steps)
	if err != nil {
		return fmt.Sprintf("NG: failed to make steps: %v", err)
	}

	lastIdx := len(steps) - 1
	stepNames := make([]string, 0, len(steps))
	for name := range steps {
		stepNames = append(stepNames, name)
	}
	if lastIdx < 0 {
		return "NG: no steps"
	}

	lastStepName := s.safeName(stepNames[lastIdx])
	lastKsvc := fmt.Sprintf("flow%s-%s", flowID, lastStepName)
	var prevKsvc string
	if lastIdx > 0 {
		prevKsvc = fmt.Sprintf("flow%s-%s", flowID, s.safeName(stepNames[lastIdx-1]))
	}

	deadline := time.Now().Add(time.Duration(timeoutSeconds) * time.Second)

	// Create Kick Job
	jobName, err := s.createKickJob(ctx, ns, flowID)
	if err != nil {
		return fmt.Sprintf("NG: failed to create Kick Job -> %v", err)
	}

	// Wait for Kick Job to succeed
	if !s.waitJobSucceeded(ctx, ns, jobName, deadline) {
		return fmt.Sprintf("NG: Kick Job not succeeded -> %s", jobName)
	}

	// Check previous step emitted expected type
	if prevKsvc != "" {
		expectedOutType := fmt.Sprintf("flow%s.s%d", flowID, lastIdx)
		if !s.waitPrevStepEmittedTypeKSVC(ctx, ns, prevKsvc, expectedOutType, deadline) {
			return fmt.Sprintf("NG: previous step did not emit expected out=%s -> %s", expectedOutType, prevKsvc)
		}
	}

	// Check last step received expected type
	expectedInType := fmt.Sprintf("flow%s.%s", flowID, s.getInTypeSuffix(lastIdx))
	if !s.waitLastStepReceivedKSVC(ctx, ns, lastKsvc, expectedInType, deadline) {
		topicProbe := s.probeTopicForCeTypes(ctx, ns, flowID, 20, timeoutSeconds/3)
		return fmt.Sprintf("NG: last step did not receive event (no log matched '%s') -> %s\n== topic probe ==\n%s",
			expectedInType, lastKsvc, topicProbe)
	}

	return "OK: run"
}

// ApplyAndKickVerify applies, prepares, and verifies in one go
func (s *K8sService) ApplyAndKickVerify(ctx context.Context, dto *models.K8sRequestDTO, createNamespaceIfMissing bool, timeoutSeconds int, progress ProgressCallback) string {
	applyMsg, err := s.Apply(ctx, dto, createNamespaceIfMissing, false)
	if err != nil {
		return fmt.Sprintf("NG: apply failed: %v", err)
	}

	prep := s.PrepareDeployedFlow(ctx, dto, timeoutSeconds)
	if !strings.HasPrefix(prep, "OK:") {
		return fmt.Sprintf("NG: %s", prep)
	}

	if progress != nil {
		progress("apply.ok", applyMsg, true, map[string]interface{}{
			"flowId": dto.FlowID,
		})
	}

	v := s.RunOnceAndVerify(ctx, dto, timeoutSeconds)
	if !strings.HasPrefix(v, "OK:") {
		return v
	}

	return "OK: deployed & verified"
}

// Helper methods
// MakeStep extracts code from objects and creates step map
func (s *K8sService) MakeStep(steps []int64) (map[string]string, error) {
	return s.makeStep(steps)
}

func (s *K8sService) makeStep(steps []int64) (map[string]string, error) {
	result := make(map[string]string)
	used := make(map[string]bool)
	idx := 1

	for _, objectID := range steps {
		obj, err := s.objectRepo.FindByID(objectID)
		if err != nil {
			return nil, fmt.Errorf("object not found: id=%d: %w", objectID, err)
		}

		base := s.slug(obj.Label)
		if base == "" {
			base = fmt.Sprintf("s%d", idx)
		}
		stepName := base
		for n := 2; used[stepName]; n++ {
			stepName = fmt.Sprintf("%s-%d", base, n)
		}
		used[stepName] = true

		var code string
		if len(obj.Params) > 0 {
			var params map[string]interface{}
			if err := json.Unmarshal(obj.Params, &params); err != nil {
				return nil, fmt.Errorf("invalid params JSON for object id=%d: %w", objectID, err)
			}
			if v, ok := params["code"]; ok && v != nil {
				code = fmt.Sprintf("%v", v)
			}
		}

		result[stepName] = code
		idx++
	}

	return result, nil
}

func (s *K8sService) validateDTO(dto *models.K8sRequestDTO, steps map[string]string) error {
	if dto == nil {
		return fmt.Errorf("request body is null")
	}
	if dto.User == "" || dto.FlowID == "" {
		return fmt.Errorf("namespace, flowId are required")
	}
	if len(steps) == 0 {
		return fmt.Errorf("steps is required and must be non-empty")
	}
	for name, code := range steps {
		if code == "" || !strings.Contains(code, "def handle(") {
			return fmt.Errorf("step '%s' code must define def handle(evt: dict)", name)
		}
	}
	return nil
}

func (s *K8sService) ensureNamespace(ctx context.Context, ns string) error {
	_, err := s.clientset.CoreV1().Namespaces().Get(ctx, ns, metav1.GetOptions{})
	if err == nil {
		return nil // Already exists
	}
	// Create namespace
	namespace := &corev1.Namespace{
		ObjectMeta: metav1.ObjectMeta{
			Name: ns,
		},
	}
	_, err = s.clientset.CoreV1().Namespaces().Create(ctx, namespace, metav1.CreateOptions{})
	return err
}

func (s *K8sService) preflightPipelineCheck(ctx context.Context, ns, flowID string, steps map[string]string, perStepTimeoutSec, totalTimeoutSec int) PreflightResult {
	jobName := fmt.Sprintf("preflight-flow%s-pipeline", flowID)

	// Serialize steps to JSON and base64 encode
	stepsJSON, err := json.Marshal(steps)
	if err != nil {
		return PreflightResult{OK: false, Detail: fmt.Sprintf("Failed to serialize steps: %v", err)}
	}
	stepsB64 := base64.StdEncoding.EncodeToString(stepsJSON)

	// Build preflight Python script
	preflightScript := `import os,sys,base64,json,traceback,importlib.util,inspect,signal
class _DummyHttpResp:
    def __init__(self, code=200, data=b"{}"):
        self.status = code
        self._data = data
    def read(self, *a, **k): return self._data
    def __enter__(self): return self
    def __exit__(self, *a): pass
try:
    import urllib.request as _ur
    _orig_urlopen = _ur.urlopen
    def _guard_urlopen(req, *args, **kwargs):
        try:
            method = req.get_method()
            url    = req.full_url
            data   = getattr(req, "data", None)
        except AttributeError:
            method = "GET"; url = str(req); data = None
        if method is None: method = "POST" if data is not None else "GET"
        m = (method or "GET").upper()
        if m in ("POST","PUT","PATCH","DELETE") or "/cgi-bin/put.sh" in url:
            return _DummyHttpResp(200, b"{}")
        return _orig_urlopen(req, *args, **kwargs)
    _ur.urlopen = _guard_urlopen
except Exception: pass
try:
    import requests as _rq
    _orig_request = _rq.sessions.Session.request
    class _DummyResp:
        status_code = 200; ok = True; content = b"{}"; text = "{}"
        def raise_for_status(self): pass
        def json(self): return {}
    def _guard_request(self, method, url, *args, **kwargs):
        if (method or "").upper() in ("POST","PUT","PATCH","DELETE") or "/cgi-bin/put.sh" in str(url):
            return _DummyResp()
        return _orig_request(self, method, url, *args, **kwargs)
    _rq.sessions.Session.request = _guard_request
except Exception: pass
def alarm_handler(signum, frame): raise TimeoutError('TIMEOUT')
def load_step(name, code, path):
    try: compile(code, path, 'exec')
    except SyntaxError as e:
        print(f"STEP {name} SYNTAX_ERROR: {e.msg} at line {e.lineno} col {e.offset}"); sys.exit(2)
    spec = importlib.util.spec_from_file_location(name, path)
    mod  = importlib.util.module_from_spec(spec)
    try: spec.loader.exec_module(mod)
    except Exception:
        print(f"STEP {name} IMPORT_ERROR:"); traceback.print_exc(); sys.exit(3)
    if not hasattr(mod, "handle") or not callable(mod.handle):
        print(f"STEP {name} MISSING_HANDLE: def handle(evt: dict) not found or not callable"); sys.exit(4)
    try:
        sig = inspect.signature(mod.handle)
        if len(sig.parameters) != 1:
            print(f"STEP {name} BAD_SIGNATURE: handle must accept exactly 1 parameter"); sys.exit(5)
    except Exception as e:
        print(f"STEP {name} SIGNATURE_CHECK_FAILED: {e}"); sys.exit(6)
    return mod
steps = json.loads(base64.b64decode(os.environ['STEPS_B64']).decode('utf-8','replace'))
per_to = int(os.environ.get('PER_STEP_TIMEOUT', '20'))
event = {"kick": True}
names = list(steps.keys())
for idx, name in enumerate(names):
    code = steps[name]; path = f"/tmp/{name}.py"; open(path, "w").write(code)
    mod = load_step(name, code, path); last = (idx == len(names)-1)
    signal.signal(signal.SIGALRM, alarm_handler); signal.alarm(per_to)
    try: out = mod.handle(event if isinstance(event, dict) else {})
    except Exception:
        print(f"STEP {name} RUNTIME_EXCEPTION:"); traceback.print_exc(); sys.exit(10)
    finally: signal.alarm(0)
    import json as _json
    if out is None: out_list = []
    elif isinstance(out, dict): out_list = [out]
    elif isinstance(out, list): out_list = out
    else:
        if last:
            try: _json.dumps(out)
            except Exception as e:
                print(f"STEP {name} NOT_JSON_SERIALIZABLE: {e}"); sys.exit(12)
            break
        print(f"STEP {name} BAD_RETURN: expected dict or list of dicts, got {type(out).__name__}"); sys.exit(11)
    if not last and not out_list:
        print(f"STEP {name} EMPTY_OUTPUT: downstream step would receive nothing"); sys.exit(13)
    if out_list:
        if not isinstance(out_list[0], dict):
            print(f"STEP {name} BAD_RETURN_ITEM: first item is {type(out_list[0]).__name__}, not dict"); sys.exit(14)
        try: _json.dumps(out_list[0])
        except Exception as e:
            print(f"STEP {name} JSON_SERIALIZE_FAIL: {e}"); sys.exit(15)
        event = out_list[0]
    else: event = {}
print("OK")
`

	// Create Job
	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name: jobName,
			Labels: map[string]string{
				"flow_id":  flowID,
				"purpose":  "preflight",
			},
		},
		Spec: batchv1.JobSpec{
			BackoffLimit:            int32Ptr(0),
			TTLSecondsAfterFinished: int32Ptr(60),
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					RestartPolicy: corev1.RestartPolicyNever,
					Containers: []corev1.Container{
						{
							Name:            "check",
							Image:           s.pyImage,
							ImagePullPolicy: corev1.PullNever,
							Env: []corev1.EnvVar{
								{Name: "STEPS_B64", Value: stepsB64},
								{Name: "PER_STEP_TIMEOUT", Value: fmt.Sprintf("%d", perStepTimeoutSec)},
								{Name: "PREFLIGHT", Value: "1"},
							},
							Command: []string{"/bin/sh", "-c"},
							Args:    []string{fmt.Sprintf("python - <<'PY'\n%s\nPY", preflightScript)},
							Resources: corev1.ResourceRequirements{
								Requests: corev1.ResourceList{
									corev1.ResourceCPU:    resource.MustParse("100m"),
									corev1.ResourceMemory: resource.MustParse("256Mi"),
								},
								Limits: corev1.ResourceList{
									corev1.ResourceCPU:    resource.MustParse("1"),
									corev1.ResourceMemory: resource.MustParse("768Mi"),
								},
							},
						},
					},
				},
			},
		},
	}

	_, err = s.clientset.BatchV1().Jobs(ns).Create(ctx, job, metav1.CreateOptions{})
	if err != nil {
		if errors.IsAlreadyExists(err) {
			_, err = s.clientset.BatchV1().Jobs(ns).Update(ctx, job, metav1.UpdateOptions{})
		}
		if err != nil {
			return PreflightResult{OK: false, Detail: fmt.Sprintf("Failed to create preflight job: %v", err)}
		}
	}

	// Wait for job completion
	deadline := time.Now().Add(time.Duration(totalTimeoutSec) * time.Second)
	finished := false
	for time.Now().Before(deadline) {
		job, err := s.clientset.BatchV1().Jobs(ns).Get(ctx, jobName, metav1.GetOptions{})
		if err != nil {
			time.Sleep(200 * time.Millisecond)
			continue
		}
		if job.Status.Succeeded > 0 || job.Status.Failed > 0 {
			finished = true
			break
		}
		time.Sleep(500 * time.Millisecond)
	}

	// Get logs
	logs := ""
	if finished {
		pods, err := s.clientset.CoreV1().Pods(ns).List(ctx, metav1.ListOptions{
			LabelSelector: fmt.Sprintf("job-name=%s", jobName),
		})
		if err == nil && len(pods.Items) > 0 {
			podName := pods.Items[0].Name
			logStream, err := s.clientset.CoreV1().Pods(ns).GetLogs(podName, &corev1.PodLogOptions{}).Stream(ctx)
			if err == nil {
				defer logStream.Close()
				var logBytes []byte
				logBytes, _ = io.ReadAll(logStream)
				logs = string(logBytes)
			}
		}
	}

	if !finished {
		logsTruncated := logs
		if len(logsTruncated) > 4000 {
			logsTruncated = logsTruncated[:4000] + "\n...(truncated)"
		}
		return PreflightResult{
			OK:     false,
			Detail: fmt.Sprintf("Preflight timeout (%ds)\n%s", totalTimeoutSec, logsTruncated),
		}
	}

	ok := strings.Contains(logs, "OK")
	if ok {
		return PreflightResult{OK: true, Detail: "OK"}
	}

	logsTruncated := logs
	if logsTruncated == "" {
		logsTruncated = "No logs"
	}
	if len(logsTruncated) > 4000 {
		logsTruncated = logsTruncated[:4000] + "\n... (truncated)"
	}
	return PreflightResult{OK: false, Detail: logsTruncated}
}

func (s *K8sService) createKafkaTopic(ctx context.Context, flowID string) error {
	gvr := schema.GroupVersionResource{
		Group:    "kafka.strimzi.io",
		Version:  "v1beta2",
		Resource: "kafkatopics",
	}

	kt := &unstructured.Unstructured{
		Object: map[string]interface{}{
			"apiVersion": "kafka.strimzi.io/v1beta2",
			"kind":       "KafkaTopic",
			"metadata": map[string]interface{}{
				"name":      flowID,
				"namespace": s.kafkaNamespace,
				"labels": map[string]interface{}{
					"strimzi.io/cluster": s.kafkaCluster,
					"flow_id":            flowID,
				},
			},
			"spec": map[string]interface{}{
				"partitions": 1,
				"replicas":   3,
			},
		},
	}

	_, err := s.dynamicClient.Resource(gvr).Namespace(s.kafkaNamespace).Create(ctx, kt, metav1.CreateOptions{})
	if err != nil && !errors.IsAlreadyExists(err) {
		// Try update if exists
		_, err = s.dynamicClient.Resource(gvr).Namespace(s.kafkaNamespace).Update(ctx, kt, metav1.UpdateOptions{})
	}
	return err
}

func (s *K8sService) createKafkaSink(ctx context.Context, ns, flowID string) error {
	gvr := schema.GroupVersionResource{
		Group:    "eventing.knative.dev",
		Version:  "v1alpha1",
		Resource: "kafkasinks",
	}

	ks := &unstructured.Unstructured{
		Object: map[string]interface{}{
			"apiVersion": "eventing.knative.dev/v1alpha1",
			"kind":       "KafkaSink",
			"metadata": map[string]interface{}{
				"name":      "sink-" + flowID,
				"namespace": ns,
				"labels": map[string]interface{}{
					"flow_id": flowID,
				},
			},
			"spec": map[string]interface{}{
				"bootstrapServers": []string{s.kafkaBootstrap},
				"topic":            flowID,
			},
		},
	}

	_, err := s.dynamicClient.Resource(gvr).Namespace(ns).Create(ctx, ks, metav1.CreateOptions{})
	if err != nil && !errors.IsAlreadyExists(err) {
		// Try update if exists
		_, err = s.dynamicClient.Resource(gvr).Namespace(ns).Update(ctx, ks, metav1.UpdateOptions{})
	}
	return err
}

func (s *K8sService) createConfigMap(ctx context.Context, ns, cmName, flowID, code string) error {
	cm := &corev1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name: cmName,
			Labels: map[string]string{
				"flow_id": flowID,
			},
		},
		Data: map[string]string{
			"user_code.py": code,
		},
	}
	_, err := s.clientset.CoreV1().ConfigMaps(ns).Create(ctx, cm, metav1.CreateOptions{})
	if err != nil {
		// Try update if exists
		_, err = s.clientset.CoreV1().ConfigMaps(ns).Update(ctx, cm, metav1.UpdateOptions{})
	}
	return err
}

func (s *K8sService) createOrRecreateKsvc(ctx context.Context, ns, flowID, cmName, ksvcName, stepName, inType, outType, codeHash string, maxScale int) error {
	gvr := schema.GroupVersionResource{
		Group:    "serving.knative.dev",
		Version:  "v1",
		Resource: "services",
	}

	// Build K_SINK URL (last step has no output)
	ksinkURL := fmt.Sprintf("http://kafka-sink-ingress.knative-eventing.svc.cluster.local/%s/sink-%s", ns, flowID)
	if outType == "" {
		ksinkURL = ""
	}

	// Build environment variables
	envList := []map[string]interface{}{
		{"name": "FLOW_ID", "value": flowID},
		{"name": "APP_ID", "value": stepName},
		{"name": "IN_TYPES", "value": inType},
		{"name": "OUT_TYPE", "value": outType},
		{"name": "MAX_HOPS", "value": "5"},
		{"name": "DEDUPE_WINDOW_SEC", "value": "60"},
		{"name": "K_SINK", "value": ksinkURL},
	}

	// Build container command with RUNNER_PY
	runnerScript := fmt.Sprintf(`cat <<'PY' > /tmp/runner.py
%s
PY
exec python -u /tmp/runner.py`, RUNNER_PY)

	// Build KService spec
	ksvc := &unstructured.Unstructured{
		Object: map[string]interface{}{
			"apiVersion": "serving.knative.dev/v1",
			"kind":       "Service",
			"metadata": map[string]interface{}{
				"name":      ksvcName,
				"namespace": ns,
				"labels": map[string]interface{}{
					"app":     ksvcName,
					"flow_id": flowID,
				},
			},
			"spec": map[string]interface{}{
				"template": map[string]interface{}{
					"metadata": map[string]interface{}{
						"annotations": map[string]interface{}{
							"flow/code-hash":                        codeHash,
							"autoscaling.knative.dev/minScale":       "1",
							"autoscaling.knative.dev/maxScale":       fmt.Sprintf("%d", maxScale),
						},
						"labels": map[string]interface{}{
							"app":     ksvcName,
							"flow_id": flowID,
						},
					},
					"spec": map[string]interface{}{
						"containers": []map[string]interface{}{
							{
								"name":            "app",
								"image":           s.pyImage,
								"imagePullPolicy": "Never",
								"ports": []map[string]interface{}{
									{"containerPort": 8080},
								},
								"env": envList,
								"volumeMounts": []map[string]interface{}{
									{
										"name":      "usercode",
										"mountPath": "/code",
										"readOnly":  true,
									},
									{
										"name":      "tmp",
										"mountPath": "/tmp",
									},
								},
								"command": []string{"/bin/sh", "-c"},
								"args":    []string{runnerScript},
							},
						},
						"volumes": []map[string]interface{}{
							{
								"name": "usercode",
								"configMap": map[string]interface{}{
									"name": cmName,
									"items": []map[string]interface{}{
										{
											"key":  "user_code.py",
											"path": "user_code.py",
										},
									},
								},
							},
							{
								"name":     "tmp",
								"emptyDir": map[string]interface{}{},
							},
						},
					},
				},
			},
		},
	}

	// Try create or replace
	_, err := s.dynamicClient.Resource(gvr).Namespace(ns).Create(ctx, ksvc, metav1.CreateOptions{})
	if err != nil {
		if errors.IsAlreadyExists(err) {
			// Try update
			_, err = s.dynamicClient.Resource(gvr).Namespace(ns).Update(ctx, ksvc, metav1.UpdateOptions{})
			if err != nil {
				// Check if error is about immutable annotation
				if strings.Contains(err.Error(), "annotation value is immutable") {
					// Delete and recreate
					if delErr := s.dynamicClient.Resource(gvr).Namespace(ns).Delete(ctx, ksvcName, metav1.DeleteOptions{}); delErr != nil {
						return fmt.Errorf("failed to delete existing KSVC: %w", delErr)
					}
					// Wait a bit for deletion
					time.Sleep(500 * time.Millisecond)
					// Create new
					_, err = s.dynamicClient.Resource(gvr).Namespace(ns).Create(ctx, ksvc, metav1.CreateOptions{})
				}
			}
		}
	}
	return err
}

func (s *K8sService) createKafkaSourceToKSVC(ctx context.Context, ns, flowID, ksvcName, cg string) error {
	gvr := schema.GroupVersionResource{
		Group:    "sources.knative.dev",
		Version:  "v1",
		Resource: "kafkasources",
	}

	srcName := fmt.Sprintf("source-%s-to-%s", flowID, ksvcName)
	ks := &unstructured.Unstructured{
		Object: map[string]interface{}{
			"apiVersion": "sources.knative.dev/v1",
			"kind":       "KafkaSource",
			"metadata": map[string]interface{}{
				"name":      srcName,
				"namespace": ns,
				"labels": map[string]interface{}{
					"flow_id": flowID,
				},
			},
			"spec": map[string]interface{}{
				"consumerGroup":    cg,
				"initialOffset":    "latest",
				"bootstrapServers": []string{s.kafkaBootstrap},
				"topics":           []string{flowID},
				"sink": map[string]interface{}{
					"ref": map[string]interface{}{
						"apiVersion": "serving.knative.dev/v1",
						"kind":       "Service",
						"name":       ksvcName,
					},
				},
			},
		},
	}

	_, err := s.dynamicClient.Resource(gvr).Namespace(ns).Create(ctx, ks, metav1.CreateOptions{})
	if err != nil && !errors.IsAlreadyExists(err) {
		// Try update if exists
		_, err = s.dynamicClient.Resource(gvr).Namespace(ns).Update(ctx, ks, metav1.UpdateOptions{})
	}
	return err
}

func (s *K8sService) createKickJob(ctx context.Context, ns, flowID string) (string, error) {
	jobName := fmt.Sprintf("kick-flow-%s-%s", flowID, s.randomString(8))

	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name: jobName,
			Labels: map[string]string{
				"flow_id": flowID,
			},
		},
		Spec: batchv1.JobSpec{
			BackoffLimit:            int32Ptr(0),
			TTLSecondsAfterFinished: int32Ptr(60),
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					RestartPolicy: corev1.RestartPolicyNever,
					Containers: []corev1.Container{
						{
							Name:    "kcat",
							Image:   "edenhill/kcat:1.7.1",
							Command: []string{"/bin/sh", "-c"},
							Args: []string{
								fmt.Sprintf(`PAY='{"kick":true}'
CID=$(cat /proc/sys/kernel/random/uuid)
echo "$PAY" | kcat -P -b %s -t %s \
  -H "ce_specversion=1.0" \
  -H "ce_type=flow%s.kick" \
  -H "ce_source=/flow/%s/kick" \
  -H "ce_id=$CID"
echo "[KICK] sent to %s (ce_type=flow%s.kick)" >&2`, s.kafkaBootstrap, flowID, flowID, flowID, flowID, flowID),
							},
						},
					},
				},
			},
		},
	}

	_, err := s.clientset.BatchV1().Jobs(ns).Create(ctx, job, metav1.CreateOptions{})
	if err != nil {
		_, err = s.clientset.BatchV1().Jobs(ns).Update(ctx, job, metav1.UpdateOptions{})
	}
	return jobName, err
}

// isCRReady checks if a CustomResource is ready by checking conditions
func (s *K8sService) isCRReady(res *unstructured.Unstructured) bool {
	if res == nil {
		return false
	}
	status, ok, _ := unstructured.NestedMap(res.Object, "status")
	if !ok {
		return false
	}
	conditions, ok, _ := unstructured.NestedSlice(status, "conditions")
	if !ok {
		return false
	}
	for _, cond := range conditions {
		if condMap, ok := cond.(map[string]interface{}); ok {
			condType, _ := condMap["type"].(string)
			condStatus, _ := condMap["status"].(string)
			if condType == "Ready" && condStatus == "True" {
				return true
			}
		}
	}
	return false
}

func (s *K8sService) waitKServiceReady(ctx context.Context, ns, name string, timeout time.Duration) bool {
	gvr := schema.GroupVersionResource{
		Group:    "serving.knative.dev",
		Version:  "v1",
		Resource: "services",
	}
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		res, err := s.dynamicClient.Resource(gvr).Namespace(ns).Get(ctx, name, metav1.GetOptions{})
		if err == nil && s.isCRReady(res) {
			return true
		}
		time.Sleep(700 * time.Millisecond)
	}
	return false
}

func (s *K8sService) waitKafkaSinkReady(ctx context.Context, ns, name string, deadline time.Time) bool {
	gvr := schema.GroupVersionResource{
		Group:    "eventing.knative.dev",
		Version:  "v1alpha1",
		Resource: "kafkasinks",
	}
	for time.Now().Before(deadline) {
		res, err := s.dynamicClient.Resource(gvr).Namespace(ns).Get(ctx, name, metav1.GetOptions{})
		if err == nil && s.isCRReady(res) {
			return true
		}
		time.Sleep(1000 * time.Millisecond)
	}
	return false
}

func (s *K8sService) waitKafkaSourceReady(ctx context.Context, ns, name string, deadline time.Time) bool {
	gvr := schema.GroupVersionResource{
		Group:    "sources.knative.dev",
		Version:  "v1",
		Resource: "kafkasources",
	}
	for time.Now().Before(deadline) {
		res, err := s.dynamicClient.Resource(gvr).Namespace(ns).Get(ctx, name, metav1.GetOptions{})
		if err == nil && s.isCRReady(res) {
			return true
		}
		time.Sleep(800 * time.Millisecond)
	}
	return false
}

func (s *K8sService) waitJobSucceeded(ctx context.Context, ns, jobName string, deadline time.Time) bool {
	// Get job UID first
	var jobUID string
	for time.Now().Before(deadline) {
		job, err := s.clientset.BatchV1().Jobs(ns).Get(ctx, jobName, metav1.GetOptions{})
		if err == nil && job.UID != "" {
			jobUID = string(job.UID)
			break
		}
		time.Sleep(200 * time.Millisecond)
	}
	if jobUID == "" {
		return false
	}

	// Wait for job with same UID to succeed
	for time.Now().Before(deadline) {
		job, err := s.clientset.BatchV1().Jobs(ns).Get(ctx, jobName, metav1.GetOptions{})
		if err == nil && string(job.UID) == jobUID {
			if job.Status.Succeeded > 0 {
				return true
			}
			if job.Status.Failed > 0 {
				return false
			}
		}
		time.Sleep(500 * time.Millisecond)
	}
	return false
}

func (s *K8sService) waitPrevStepEmittedTypeKSVC(ctx context.Context, ns, ksvcName, expectedOutType string, deadline time.Time) bool {
	needle1 := fmt.Sprintf("emit ce_type=%s", expectedOutType)
	needle2 := fmt.Sprintf(" out=%s", expectedOutType)
	for time.Now().Before(deadline) {
		pods, err := s.clientset.CoreV1().Pods(ns).List(ctx, metav1.ListOptions{
			LabelSelector: fmt.Sprintf("app=%s", ksvcName),
		})
		if err == nil {
			for _, pod := range pods.Items {
				logStream, err := s.clientset.CoreV1().Pods(ns).GetLogs(pod.Name, &corev1.PodLogOptions{
					Container: "app",
					TailLines: int64Ptr(1000),
				}).Stream(ctx)
				if err == nil {
					logBytes, _ := io.ReadAll(logStream)
					logStream.Close()
					log := string(logBytes)
					if strings.Contains(log, needle1) || strings.Contains(log, needle2) {
						return true
					}
				}
			}
		}
		time.Sleep(800 * time.Millisecond)
	}
	return false
}

func (s *K8sService) waitLastStepReceivedKSVC(ctx context.Context, ns, ksvcName, expectedInType string, deadline time.Time) bool {
	needle := fmt.Sprintf("in=%s", expectedInType)
	for time.Now().Before(deadline) {
		pods, err := s.clientset.CoreV1().Pods(ns).List(ctx, metav1.ListOptions{
			LabelSelector: fmt.Sprintf("app=%s", ksvcName),
		})
		if err == nil {
			for _, pod := range pods.Items {
				logStream, err := s.clientset.CoreV1().Pods(ns).GetLogs(pod.Name, &corev1.PodLogOptions{
					Container: "app",
					TailLines: int64Ptr(1000),
				}).Stream(ctx)
				if err == nil {
					logBytes, _ := io.ReadAll(logStream)
					logStream.Close()
					log := string(logBytes)
					if strings.Contains(log, needle) {
						return true
					}
				}
			}
		}
		time.Sleep(1000 * time.Millisecond)
	}
	return false
}

func (s *K8sService) probeTopicForCeTypes(ctx context.Context, ns, flowID string, maxCount, timeoutSec int) string {
	jobName := fmt.Sprintf("probe-%s-%s", flowID, s.randomString(8))
	if maxCount < 5 {
		maxCount = 5
	}

	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name: jobName,
			Labels: map[string]string{
				"flow_id": flowID,
			},
		},
		Spec: batchv1.JobSpec{
			BackoffLimit:            int32Ptr(0),
			TTLSecondsAfterFinished: int32Ptr(60),
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					RestartPolicy: corev1.RestartPolicyNever,
					Containers: []corev1.Container{
						{
							Name:    "kcat",
							Image:   "edenhill/kcat:1.7.1",
							Command: []string{"/bin/sh", "-c"},
							Args: []string{
								fmt.Sprintf("kcat -C -b %s -t %s -o end -e -q -u -c %d -f 'ts=%%T key=%%k headers=%%h payload=%%s\\n' || true", s.kafkaBootstrap, flowID, maxCount),
							},
						},
					},
				},
			},
		},
	}

	_, err := s.clientset.BatchV1().Jobs(ns).Create(ctx, job, metav1.CreateOptions{})
	if err != nil {
		if errors.IsAlreadyExists(err) {
			_, err = s.clientset.BatchV1().Jobs(ns).Update(ctx, job, metav1.UpdateOptions{})
		}
		if err != nil {
			return fmt.Sprintf("probe error: %v", err)
		}
	}

	deadline := time.Now().Add(time.Duration(timeoutSec) * time.Second)
	for time.Now().Before(deadline) {
		job, err := s.clientset.BatchV1().Jobs(ns).Get(ctx, jobName, metav1.GetOptions{})
		if err == nil && (job.Status.Succeeded > 0 || job.Status.Failed > 0) {
			break
		}
		time.Sleep(500 * time.Millisecond)
	}

	logs := ""
	pods, err := s.clientset.CoreV1().Pods(ns).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("job-name=%s", jobName),
	})
	if err == nil && len(pods.Items) > 0 {
		podName := pods.Items[0].Name
		logStream, err := s.clientset.CoreV1().Pods(ns).GetLogs(podName, &corev1.PodLogOptions{}).Stream(ctx)
		if err == nil {
			defer logStream.Close()
			logBytes, _ := io.ReadAll(logStream)
			logs = string(logBytes)
		}
	}

	if len(logs) > 4000 {
		logs = logs[:4000] + "\n...(truncated)"
	}
	return logs
}

// FlowChanged checks if flow has changed by comparing code hashes
func (s *K8sService) FlowChanged(ctx context.Context, ns, flowID string, steps map[string]string) bool {
	gvr := schema.GroupVersionResource{
		Group:    "serving.knative.dev",
		Version:  "v1",
		Resource: "services",
	}
	for stepNameRaw := range steps {
		ksvcName := fmt.Sprintf("flow%s-%s", flowID, s.safeName(stepNameRaw))
		res, err := s.dynamicClient.Resource(gvr).Namespace(ns).Get(ctx, ksvcName, metav1.GetOptions{})
		if err != nil {
			return true // Not found means changed
		}
		spec, ok, _ := unstructured.NestedMap(res.Object, "spec")
		if !ok {
			return true
		}
		tpl, ok, _ := unstructured.NestedMap(spec, "template")
		if !ok {
			return true
		}
		meta, ok, _ := unstructured.NestedMap(tpl, "metadata")
		if !ok {
			return true
		}
		ann, ok, _ := unstructured.NestedStringMap(meta, "annotations")
		if !ok {
			return true
		}
		existsHash, _ := ann["flow/code-hash"]
		wantHash := s.sha256(steps[stepNameRaw])
		if existsHash != wantHash {
			return true
		}
	}
	return false
}

func (s *K8sService) pruneStaleFlowSteps(ctx context.Context, ns, flowID string, aliveKsvcNames map[string]bool) {
	// Prune KSVCs
	ksvcGVR := schema.GroupVersionResource{
		Group:    "serving.knative.dev",
		Version:  "v1",
		Resource: "services",
	}
	ksvcs, err := s.dynamicClient.Resource(ksvcGVR).Namespace(ns).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("flow_id=%s", flowID),
	})
	if err == nil {
		for _, item := range ksvcs.Items {
			name, _, _ := unstructured.NestedString(item.Object, "metadata", "name")
			if name != "" && !aliveKsvcNames[name] {
				s.dynamicClient.Resource(ksvcGVR).Namespace(ns).Delete(ctx, name, metav1.DeleteOptions{})
			}
		}
	}

	// Prune KafkaSources
	ksGVR := schema.GroupVersionResource{
		Group:    "sources.knative.dev",
		Version:  "v1",
		Resource: "kafkasources",
	}
	sources, err := s.dynamicClient.Resource(ksGVR).Namespace(ns).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("flow_id=%s", flowID),
	})
	if err == nil {
		for _, item := range sources.Items {
			name, _, _ := unstructured.NestedString(item.Object, "metadata", "name")
			if name != "" {
				// Check if this source is for an alive KSVC
				keep := false
				for ksvcName := range aliveKsvcNames {
					if name == fmt.Sprintf("source-%s-to-%s", flowID, ksvcName) {
						keep = true
						break
					}
				}
				if !keep {
					s.dynamicClient.Resource(ksGVR).Namespace(ns).Delete(ctx, name, metav1.DeleteOptions{})
				}
			}
		}
	}
}

// Utility methods
func (s *K8sService) getInType(flowID string, idx int) string {
	if idx == 0 {
		return fmt.Sprintf("flow%s.kick", flowID)
	}
	return fmt.Sprintf("flow%s.s%d", flowID, idx)
}

func (s *K8sService) getOutType(flowID string, idx, total int) string {
	if idx == total-1 {
		return "" // Last step has no output
	}
	return fmt.Sprintf("flow%s.s%d", flowID, idx+1)
}

func (s *K8sService) getInTypeSuffix(idx int) string {
	if idx == 0 {
		return "kick"
	}
	return fmt.Sprintf("s%d", idx)
}

func (s *K8sService) safeName(str string) string {
	slug := s.slug(str)
	if len(slug) > 63 {
		slug = slug[:63]
	}
	return slug
}

func (s *K8sService) slug(str string) string {
	if str == "" {
		return ""
	}
	// Convert to lowercase
	result := strings.ToLower(str)
	// Replace non-alphanumeric characters with dash
	re := regexp.MustCompile(`[^a-z0-9-]+`)
	result = re.ReplaceAllString(result, "-")
	// Remove leading/trailing dashes
	result = strings.Trim(result, "-")
	// Remove consecutive dashes
	re2 := regexp.MustCompile(`-+`)
	result = re2.ReplaceAllString(result, "-")
	return result
}

func (s *K8sService) sha256(str string) string {
	h := sha256.Sum256([]byte(str))
	return hex.EncodeToString(h[:])
}

func (s *K8sService) randomString(length int) string {
	b := make([]byte, (length+1)/2)
	rand.Read(b)
	return hex.EncodeToString(b)[:length]
}

func int32Ptr(i int32) *int32 {
	return &i
}

func int64Ptr(i int64) *int64 {
	return &i
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// DeleteByFlowId deletes all namespaced resources for a flow
func (s *K8sService) DeleteByFlowId(ctx context.Context, namespace, flowID string) (string, error) {
	sel := fmt.Sprintf("flow_id=%s", flowID)

	// Delete KSVCs
	ksvcGVR := schema.GroupVersionResource{
		Group:    "serving.knative.dev",
		Version:  "v1",
		Resource: "services",
	}
	ksvcs, err := s.dynamicClient.Resource(ksvcGVR).Namespace(namespace).List(ctx, metav1.ListOptions{
		LabelSelector: sel,
	})
	if err == nil {
		for _, item := range ksvcs.Items {
			name, _, _ := unstructured.NestedString(item.Object, "metadata", "name")
			if name != "" {
				s.dynamicClient.Resource(ksvcGVR).Namespace(namespace).Delete(ctx, name, metav1.DeleteOptions{})
			}
		}
	}

	// Delete ConfigMaps
	configMaps, err := s.clientset.CoreV1().ConfigMaps(namespace).List(ctx, metav1.ListOptions{
		LabelSelector: sel,
	})
	if err == nil {
		for _, cm := range configMaps.Items {
			s.clientset.CoreV1().ConfigMaps(namespace).Delete(ctx, cm.Name, metav1.DeleteOptions{})
		}
	}

	// Delete Jobs
	jobs, err := s.clientset.BatchV1().Jobs(namespace).List(ctx, metav1.ListOptions{
		LabelSelector: sel,
	})
	if err == nil {
		for _, job := range jobs.Items {
			s.clientset.BatchV1().Jobs(namespace).Delete(ctx, job.Name, metav1.DeleteOptions{})
		}
	}

	// Delete KafkaSources
	ksGVR := schema.GroupVersionResource{
		Group:    "sources.knative.dev",
		Version:  "v1",
		Resource: "kafkasources",
	}
	sources, err := s.dynamicClient.Resource(ksGVR).Namespace(namespace).List(ctx, metav1.ListOptions{
		LabelSelector: sel,
	})
	if err == nil {
		for _, item := range sources.Items {
			name, _, _ := unstructured.NestedString(item.Object, "metadata", "name")
			if name != "" {
				s.dynamicClient.Resource(ksGVR).Namespace(namespace).Delete(ctx, name, metav1.DeleteOptions{})
			}
		}
	}

	// Delete KafkaSink
	sinkGVR := schema.GroupVersionResource{
		Group:    "eventing.knative.dev",
		Version:  "v1alpha1",
		Resource: "kafkasinks",
	}
	sinkName := fmt.Sprintf("sink-%s", flowID)
	s.dynamicClient.Resource(sinkGVR).Namespace(namespace).Delete(ctx, sinkName, metav1.DeleteOptions{})

	return fmt.Sprintf("deleted namespaced resources flow_id=%s", flowID), nil
}

// makeTest extracts code from a test object (similar to makeStep but for single object)
func (s *K8sService) makeTest(testID int64) (string, error) {
	obj, err := s.objectRepo.FindByID(testID)
	if err != nil {
		return "", fmt.Errorf("object not found: id=%d: %w", testID, err)
	}

	var code string
	if len(obj.Params) > 0 {
		var params map[string]interface{}
		if err := json.Unmarshal(obj.Params, &params); err != nil {
			return "", fmt.Errorf("invalid params JSON for object id=%d: %w", testID, err)
		}
		if v, ok := params["code"]; ok && v != nil {
			code = fmt.Sprintf("%v", v)
		}
	}
	return code, nil
}

// UnitTest runs a unit test for a single step
func (s *K8sService) UnitTest(ctx context.Context, dto *models.K8sRequestDTO, timeoutSeconds int) (map[string]interface{}, error) {
	if dto == nil {
		return nil, fmt.Errorf("request body is null")
	}
	ns := "user-" + dto.User
	if ns == "" {
		return nil, fmt.Errorf("user (namespace) is required")
	}

	if dto.Test == nil {
		return nil, fmt.Errorf("test object ID is required")
	}

	code, err := s.makeTest(*dto.Test)
	if err != nil {
		return nil, err
	}

	if err := s.ensureNamespace(ctx, ns); err != nil {
		return nil, fmt.Errorf("failed to ensure namespace: %w", err)
	}

	if code == "" {
		return nil, fmt.Errorf("test code is empty")
	}

	codeB64 := base64.StdEncoding.EncodeToString([]byte(code))

	evtB64 := ""
	syntaxOnly := dto.TestInput == nil || *dto.TestInput == ""
	if !syntaxOnly {
		evtB64 = base64.StdEncoding.EncodeToString([]byte(*dto.TestInput))
	}

	jobName := fmt.Sprintf("ut1-%s-%s", s.slug(dto.FlowID), s.randomString(8))

	// Build unit test Python script
	unitTestScript := `import os,sys,base64,traceback,importlib.util,inspect,signal,time,json,ast

def emit(d): print("RESULT_JSON:"+json.dumps(d, ensure_ascii=False)); sys.stdout.flush()
class TimeoutError_(Exception): pass
def alarm_handler(signum, frame): raise TimeoutError_('TIMEOUT')

name = os.environ.get('STEP_NAME','snippet')
code = base64.b64decode(os.environ['CODE_B64']).decode('utf-8','replace')
to   = int(os.environ.get('TIMEOUT_SEC','20'))
mode = (os.environ.get('CHECK_MODE','run') or 'run').lower()  # run | syntax

# 0) 공통: 문법 검사 (실행 없이 SyntaxError만 체크)
try:
    ast.parse(code, filename=f"/tmp/{name}.py", mode='exec')
except SyntaxError as e:
    emit({"ok": False, "step": name, "error": f"SYNTAX_ERROR: {e.msg} at line {e.lineno} col {e.offset}"})
    sys.exit(2)

if mode == 'syntax':
    # 문법만 OK
    emit({"ok": True, "step": name, "check": "syntax"})
    sys.exit(0)

# ===== 아래는 run 모드 (기존과 동일) =====
def import_module_from_code(name, code, path):
    open(path,"w").write(code)
    try: compile(code, path, 'exec')
    except SyntaxError as e:
        emit({"ok": False, "step": name, "error": f"SYNTAX_ERROR: {e.msg} at line {e.lineno} col {e.offset}"})
        sys.exit(2)
    spec = importlib.util.spec_from_file_location(name, path)
    mod  = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(mod)
    except Exception:
        emit({"ok": False, "step": name, "error": "IMPORT_ERROR:\\n"+traceback.format_exc()})
        sys.exit(3)
    return mod

b = os.environ.get('TEST_EVT_B64','')
evt = {"kick": True}
if b:
    try:
        evt = json.loads(base64.b64decode(b).decode('utf-8','replace'))
        if not isinstance(evt, dict):
            evt = {"kick": True}
    except Exception:
        evt = {"kick": True}

signal.signal(signal.SIGALRM, alarm_handler); signal.alarm(max(1,to)); t0 = time.time()
try:
    mod = import_module_from_code(name, code, f"/tmp/{name}.py")
    if not hasattr(mod,'handle') or not callable(mod.handle):
        emit({"ok": False, "step": name, "error": "MISSING_HANDLE: def handle(evt: dict) not found or not callable"})
        sys.exit(4)
    sig = inspect.signature(mod.handle)
    if len(sig.parameters) != 1:
        emit({"ok": False, "step": name, "error": "BAD_SIGNATURE: handle must accept exactly 1 parameter"})
        sys.exit(5)

    result = mod.handle(evt)
    elapsed = int((time.time()-t0)*1000)
    try:
        prev = json.dumps(result)
        if len(prev) > 500: prev = prev[:500] + "...(truncated)"
        emit({"ok": True, "step": name, "timeMs": elapsed, "preview": prev})
        sys.exit(0)
    except Exception as e:
        emit({"ok": False, "step": name, "timeMs": elapsed, "error": f"NOT_JSON_SERIALIZABLE: {e}"})
        sys.exit(9)
except TimeoutError_:
    emit({"ok": False, "step": name, "error": "TIMEOUT during handle()"})
    sys.exit(7)
except Exception:
    emit({"ok": False, "step": name, "error": "RUNTIME_EXCEPTION:\\n"+traceback.format_exc()})
    sys.exit(8)
finally:
    signal.alarm(0)
`

	checkMode := "run"
	if syntaxOnly {
		checkMode = "syntax"
	}

	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name: jobName,
			Labels: map[string]string{
				"purpose": "unit-test-one",
				"app":     "k8s-flow-unit-test",
			},
		},
		Spec: batchv1.JobSpec{
			BackoffLimit:            int32Ptr(0),
			TTLSecondsAfterFinished: int32Ptr(60),
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					RestartPolicy: corev1.RestartPolicyNever,
					Containers: []corev1.Container{
						{
							Name:            "ut",
							Image:           s.pyImage,
							ImagePullPolicy: corev1.PullIfNotPresent,
							Env: []corev1.EnvVar{
								{Name: "CODE_B64", Value: codeB64},
								{Name: "TEST_EVT_B64", Value: evtB64},
								{Name: "TIMEOUT_SEC", Value: fmt.Sprintf("%d", max(1, timeoutSeconds))},
								{Name: "CHECK_MODE", Value: checkMode},
							},
							Command: []string{"/bin/sh", "-c"},
							Args:    []string{fmt.Sprintf("python -u - <<'PY'\n%s\nPY", unitTestScript)},
							Resources: corev1.ResourceRequirements{
								Requests: corev1.ResourceList{
									corev1.ResourceCPU:    resource.MustParse("100m"),
									corev1.ResourceMemory: resource.MustParse("256Mi"),
								},
								Limits: corev1.ResourceList{
									corev1.ResourceCPU:    resource.MustParse("1"),
									corev1.ResourceMemory: resource.MustParse("512Mi"),
								},
							},
						},
					},
				},
			},
		},
	}

	_, err = s.clientset.BatchV1().Jobs(ns).Create(ctx, job, metav1.CreateOptions{})
	if err != nil {
		if errors.IsAlreadyExists(err) {
			_, err = s.clientset.BatchV1().Jobs(ns).Update(ctx, job, metav1.UpdateOptions{})
		}
		if err != nil {
			return nil, fmt.Errorf("failed to create unit test job: %w", err)
		}
	}

	// Wait for job completion
	deadline := time.Now().Add(time.Duration(timeoutSeconds) * time.Second)
	finished := false
	for time.Now().Before(deadline) {
		job, err := s.clientset.BatchV1().Jobs(ns).Get(ctx, jobName, metav1.GetOptions{})
		if err == nil && (job.Status.Succeeded > 0 || job.Status.Failed > 0) {
			finished = true
			break
		}
		time.Sleep(500 * time.Millisecond)
	}

	// Get logs
	logs := ""
	pods, err := s.clientset.CoreV1().Pods(ns).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("job-name=%s", jobName),
	})
	if err == nil && len(pods.Items) > 0 {
		podName := pods.Items[0].Name
		logStream, err := s.clientset.CoreV1().Pods(ns).GetLogs(podName, &corev1.PodLogOptions{}).Stream(ctx)
		if err == nil {
			defer logStream.Close()
			logBytes, _ := io.ReadAll(logStream)
			logs = string(logBytes)
		}
	}

	resp := make(map[string]interface{})
	resp["job"] = jobName
	resp["finished"] = finished

	parsed := s.parseResultJsonFromLogs(logs)
	if parsed != nil {
		for k, v := range parsed {
			resp[k] = v
		}
	} else {
		resp["ok"] = false
		resp["error"] = "RESULT_JSON not found in logs"
	}

	if logs != "" {
		logsTruncated := logs
		if len(logsTruncated) > 4000 {
			logsTruncated = logsTruncated[:4000] + "\n...(truncated)"
		}
		resp["logs"] = logsTruncated
	}

	return resp, nil
}

// parseResultJsonFromLogs parses RESULT_JSON from logs
func (s *K8sService) parseResultJsonFromLogs(logs string) map[string]interface{} {
	if logs == "" {
		return nil
	}
	logsTrimmed := strings.TrimSpace(logs)
	if logsTrimmed == "" {
		return nil
	}

	// 1) RESULT_JSON 우선
	re1 := regexp.MustCompile(`(?m)^\s*RESULT_JSON\s*[:=]\s*(\{.*?\})\s*$`)
	matches := re1.FindStringSubmatch(logsTrimmed)
	if len(matches) > 1 {
		var result map[string]interface{}
		if err := json.Unmarshal([]byte(matches[1]), &result); err == nil {
			return result
		}
	}

	// 2) 문자열/이스케이프 고려하여 마지막 완결 JSON 찾기
	var last map[string]interface{}
	depth := 0
	start := -1
	inStr := false
	esc := false
	for i, c := range logsTrimmed {
		if esc {
			esc = false
			continue
		}
		if c == '\\' {
			if inStr {
				esc = true
			}
			continue
		}
		if c == '"' {
			inStr = !inStr
			continue
		}
		if inStr {
			continue
		}
		if c == '{' {
			if depth == 0 {
				start = i
			}
			depth++
		} else if c == '}' {
			if depth > 0 {
				depth--
				if depth == 0 && start >= 0 {
					var result map[string]interface{}
					if err := json.Unmarshal([]byte(logsTrimmed[start:i+1]), &result); err == nil {
						last = result
					}
					start = -1
				}
			}
		}
	}
	if last != nil {
		return last
	}

	// 3) 한 줄 JSON 후보
	re2 := regexp.MustCompile(`(\{[^\r\n]*\})`)
	matches2 := re2.FindAllStringSubmatch(logsTrimmed, -1)
	for _, match := range matches2 {
		if len(match) > 1 {
			var result map[string]interface{}
			if err := json.Unmarshal([]byte(match[1]), &result); err == nil {
				return result
			}
		}
	}

	return nil
}

// DeleteKafkaTopic deletes a KafkaTopic in the kafka namespace
func (s *K8sService) DeleteKafkaTopic(ctx context.Context, kafkaNamespace, flowID string) error {
	gvr := schema.GroupVersionResource{
		Group:    "kafka.strimzi.io",
		Version:  "v1beta2",
		Resource: "kafkatopics",
	}
	return s.dynamicClient.Resource(gvr).Namespace(kafkaNamespace).Delete(ctx, flowID, metav1.DeleteOptions{})
}
