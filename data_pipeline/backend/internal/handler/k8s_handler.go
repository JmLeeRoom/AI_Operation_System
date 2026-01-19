package handler

import (
	"data-pipeline-backend/internal/models"
	"data-pipeline-backend/internal/service"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func (h *Handler) DeployStream(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var dto models.K8sRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	op := r.URL.Query().Get("op")
	if op == "" {
		op = "deploy"
	}
	createNamespaceIfMissing := r.URL.Query().Get("createNamespaceIfMissing") == "true"
	verifyTimeoutSeconds := 40
	if v := r.URL.Query().Get("verifyTimeoutSeconds"); v != "" {
		if parsed, err := strconv.Atoi(v); err == nil {
			verifyTimeoutSeconds = parsed
		}
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	ctx := r.Context()
	k8sService, err := service.NewK8sService(h.objectRepo)
	if err != nil {
		h.sendSSEWithID(w, "error", "", models.ProgressEventDTO{
			Phase:   "error",
			Message: fmt.Sprintf("Failed to create K8s service: %v", err),
			OK:      false,
		})
		return
	}

	opID := fmt.Sprintf("%d", time.Now().UnixNano())
	t0 := time.Now()

	h.sendSSEWithID(w, "hello", opID, models.ProgressEventDTO{
		Phase:   "hello",
		Message: "operation started",
		OK:      true,
		Data: map[string]interface{}{
			"op":   op,
			"ts":   t0.Format(time.RFC3339),
			"opId": opID,
		},
	})

	flowIDInt, err := strconv.ParseInt(dto.FlowID, 10, 64)
	if err == nil {
		if updateErr := h.flowService.UpdateLatestRun(flowIDInt); updateErr != nil {
			h.sendSSEWithID(w, "progress", opID, models.ProgressEventDTO{
				Phase:   "warning",
				Message: fmt.Sprintf("Failed to update flow latest_run: %v", updateErr),
				OK:      true,
				Data: map[string]interface{}{
					"op":        op,
					"opId":      opID,
					"elapsedMs": time.Since(t0).Milliseconds(),
				},
			})
		}
	}

	go func() {
		defer func() {
			if r := recover(); r != nil {
				err, ok := r.(error)
				if !ok {
					err = fmt.Errorf("panic: %v", r)
				}
				h.sendSSEWithID(w, "error", opID, models.ProgressEventDTO{
					Phase:   "error",
					Message: fmt.Sprintf("Internal server error: %v", err),
					OK:      false,
					Data: map[string]interface{}{
						"op":        op,
						"opId":      opID,
						"elapsedMs": time.Since(t0).Milliseconds(),
					},
				})
				if f, ok := w.(http.Flusher); ok {
					f.Flush()
				}
			}
		}()

		progress := func(phase, message string, ok bool, extra map[string]interface{}) {
			data := make(map[string]interface{})
			if extra != nil {
				for k, v := range extra {
					data[k] = v
				}
			}
			data["op"] = op
			data["elapsedMs"] = time.Since(t0).Milliseconds()

			h.sendSSEWithID(w, "progress", opID, models.ProgressEventDTO{
				Phase:   phase,
				Message: message,
				OK:      ok,
				Data:    data,
			})
		}

		if op == "kick" {
			progress("verify.start", "kick & verify", true, map[string]interface{}{
				"op":             "kick",
				"timeoutSeconds": verifyTimeoutSeconds,
			})

			result := k8sService.RunOnceAndVerify(ctx, &dto, verifyTimeoutSeconds)
			ok := len(result) > 0 && len(result) >= 2 && result[:2] == "OK"
			phase := "verify.ok"
			if !ok {
				phase = "verify.ng"
			}

			h.sendSSEWithID(w, map[bool]string{true: "progress", false: "error"}[ok], opID, models.ProgressEventDTO{
				Phase:   phase,
				Message: result,
				OK:      ok,
				Data: map[string]interface{}{
					"op":        op,
					"opId":      opID,
					"elapsedMs": time.Since(t0).Milliseconds(),
				},
			})
		} else {
			steps, err := k8sService.MakeStep(dto.Steps)
			if err != nil {
				h.sendSSEWithID(w, "error", opID, models.ProgressEventDTO{
					Phase:   "error",
					Message: fmt.Sprintf("Failed to make steps: %v", err),
					OK:      false,
					Data: map[string]interface{}{
						"op":        op,
						"opId":      opID,
						"elapsedMs": time.Since(t0).Milliseconds(),
					},
				})
				return
			}
			ns := "user-" + dto.User
			changed := k8sService.FlowChanged(ctx, ns, dto.FlowID, steps)

			if !changed {
				progress("apply.skip", "no changes; kick only", true, map[string]interface{}{
					"op": "deploy",
				})

				result := k8sService.RunOnceAndVerify(ctx, &dto, verifyTimeoutSeconds)
				ok := len(result) > 0 && len(result) >= 2 && result[:2] == "OK"
				phase := "verify.ok"
				if !ok {
					phase = "verify.ng"
				}

				h.sendSSEWithID(w, map[bool]string{true: "progress", false: "error"}[ok], opID, models.ProgressEventDTO{
					Phase:   phase,
					Message: result,
					OK:      ok,
					Data: map[string]interface{}{
						"op":        op,
						"opId":      opID,
						"elapsedMs": time.Since(t0).Milliseconds(),
					},
				})
			} else {
				progress("apply.start", fmt.Sprintf("deploying flow %s", dto.FlowID), true, map[string]interface{}{
					"op": "deploy",
				})

				result := k8sService.ApplyAndKickVerify(ctx, &dto, createNamespaceIfMissing, verifyTimeoutSeconds, progress)
				ok := len(result) > 0 && len(result) >= 2 && result[:2] == "OK"
				phase := "verify.ok"
				if !ok {
					phase = "verify.ng"
				}

				h.sendSSEWithID(w, map[bool]string{true: "progress", false: "error"}[ok], opID, models.ProgressEventDTO{
					Phase:   phase,
					Message: result,
					OK:      ok,
					Data: map[string]interface{}{
						"op":        op,
						"opId":      opID,
						"elapsedMs": time.Since(t0).Milliseconds(),
					},
				})
			}
		}

		h.sendSSEWithID(w, "done", opID, models.ProgressEventDTO{
			Phase:   "done",
			Message: "operation finished",
			OK:      true,
			Data: map[string]interface{}{
				"op":        op,
				"opId":      opID,
				"elapsedMs": time.Since(t0).Milliseconds(),
			},
		})
	}()

	<-r.Context().Done()
}

func (h *Handler) DeleteK8sResources(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	flowID := r.URL.Query().Get("flowId")
	user := r.URL.Query().Get("user")
	if flowID == "" || user == "" {
		h.Error(w, http.StatusBadRequest, "flowId and user are required")
		return
	}

	ctx := r.Context()
	k8sService, err := service.NewK8sService(h.objectRepo)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create K8s service: %v", err))
		return
	}

	ns := "user-" + user
	kafkaNs := "kafka"

	msg, err := k8sService.DeleteByFlowId(ctx, ns, flowID)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to delete flow resources: %v", err))
		return
	}

	if err := k8sService.DeleteKafkaTopic(ctx, kafkaNs, flowID); err != nil {
		msg += fmt.Sprintf(" (KafkaTopic deletion warning: %v)", err)
	} else {
		msg += " + KafkaTopic deleted in ns=" + kafkaNs
	}

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(msg))
}

func (h *Handler) UnitTest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var dto models.K8sRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	totalTimeoutSeconds := 20
	if v := r.URL.Query().Get("totalTimeoutSeconds"); v != "" {
		if parsed, err := strconv.Atoi(v); err == nil {
			totalTimeoutSeconds = parsed
		}
	}

	ctx := r.Context()
	k8sService, err := service.NewK8sService(h.objectRepo)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create K8s service: %v", err))
		return
	}

	result, err := k8sService.UnitTest(ctx, &dto, totalTimeoutSeconds)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to run unit test: %v", err))
		return
	}

	h.JSON(w, http.StatusOK, result)
}

func (h *Handler) sendSSEWithID(w http.ResponseWriter, eventName, eventID string, payload models.ProgressEventDTO) {
	data, err := json.Marshal(payload)
	if err != nil {
		data = []byte(fmt.Sprintf(`{"phase":"error","message":"Failed to marshal event: %v","ok":false}`, err))
	}

	fmt.Fprintf(w, "event: %s\n", eventName)
	if eventID != "" {
		fmt.Fprintf(w, "id: %s\n", eventID)
	}
	fmt.Fprintf(w, "data: %s\n\n", string(data))

	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}
}
