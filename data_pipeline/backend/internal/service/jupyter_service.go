package service

import (
	"bytes"
	"context"
	"data-pipeline-backend/internal/config"
	"data-pipeline-backend/internal/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

type JupyterService struct {
	baseURL    string
	apiURL     string
	token      string
	httpClient *http.Client
}

func NewJupyterService() (*JupyterService, error) {
	cfg := config.Get()
	
	baseURL := cfg.Jupyter.URL
	if baseURL == "" {
		baseURL = "http://jupyter-service:8888"
	}
	
	apiURL := cfg.Jupyter.APIURL
	if apiURL == "" {
		apiURL = fmt.Sprintf("%s/api", baseURL)
	}
	
	token := cfg.Jupyter.Token

	return &JupyterService{
		baseURL:    baseURL,
		apiURL:     apiURL,
		token:      token,
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}, nil
}

// CreateKernel creates a new Jupyter kernel
func (s *JupyterService) CreateKernel(ctx context.Context, username string) (*models.KernelResponse, error) {
	url := fmt.Sprintf("%s/kernels", s.apiURL)
	
	reqBody := map[string]interface{}{
		"name": "python3",
	}
	
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	if s.token != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Token %s", s.token))
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("failed to create kernel: status %d, body: %s", resp.StatusCode, string(body))
	}

	var kernel models.KernelResponse
	if err := json.NewDecoder(resp.Body).Decode(&kernel); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &kernel, nil
}

// DeleteKernel deletes a Jupyter kernel
func (s *JupyterService) DeleteKernel(ctx context.Context, kernelID string) error {
	url := fmt.Sprintf("%s/kernels/%s", s.apiURL, kernelID)

	req, err := http.NewRequestWithContext(ctx, "DELETE", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	if s.token != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Token %s", s.token))
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusNotFound {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to delete kernel: status %d, body: %s", resp.StatusCode, string(body))
	}

	return nil
}

// ExecuteCode executes Python code in a Jupyter kernel via WebSocket
func (s *JupyterService) ExecuteCode(ctx context.Context, kernelID string, code string) (string, error) {
	sessionID := fmt.Sprintf("%d", time.Now().UnixNano())
	
	// WebSocket URL (convert http:// to ws://)
	wsBaseURL := s.baseURL
	if len(wsBaseURL) > 4 && wsBaseURL[:4] == "http" {
		wsBaseURL = "ws" + wsBaseURL[4:]
	}
	// Jupyter Notebook API format: /api/kernels/{id}/channels
	wsURL := fmt.Sprintf("%s/api/kernels/%s/channels?session_id=%s", wsBaseURL, kernelID, sessionID)
	
	// WebSocket 연결
	dialer := websocket.Dialer{
		HandshakeTimeout: 10 * time.Second,
	}
	
	headers := http.Header{}
	if s.token != "" {
		headers.Set("Authorization", fmt.Sprintf("Token %s", s.token))
	}

	conn, _, err := dialer.Dial(wsURL, headers)
	if err != nil {
		return "", fmt.Errorf("failed to connect to Jupyter WebSocket: %w", err)
	}
	defer conn.Close()

	// 결과 수집용
	var resultBuffer bytes.Buffer
	var executionError error
	done := make(chan bool)

	// 메시지 수신 고루틴
	var executeReplyReceived bool
	go func() {
		defer close(done)
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					executionError = fmt.Errorf("websocket error: %w", err)
				}
				// If we've received execute_reply, we're done even if connection closes
				if executeReplyReceived {
					done <- true
				}
				return
			}

			var msg map[string]interface{}
			if err := json.Unmarshal(message, &msg); err != nil {
				continue
			}

			msgType, _ := msg["msg_type"].(string)
			
			switch msgType {
			case "stream":
				if content, ok := msg["content"].(map[string]interface{}); ok {
					// Check stream name (stdout or stderr)
					name, _ := content["name"].(string)
					if text, ok := content["text"].(string); ok {
						if name == "stderr" {
							resultBuffer.WriteString(fmt.Sprintf("Error: %s", text))
						} else {
							resultBuffer.WriteString(text)
						}
					}
				}
			case "execute_result":
				if content, ok := msg["content"].(map[string]interface{}); ok {
					if data, ok := content["data"].(map[string]interface{}); ok {
						// Try text/plain first, then text
						if text, ok := data["text/plain"].(string); ok {
							resultBuffer.WriteString(text)
							if !strings.HasSuffix(text, "\n") {
								resultBuffer.WriteString("\n")
							}
						} else if text, ok := data["text"].(string); ok {
							resultBuffer.WriteString(text)
							if !strings.HasSuffix(text, "\n") {
								resultBuffer.WriteString("\n")
							}
						}
					}
				}
			case "error":
				if content, ok := msg["content"].(map[string]interface{}); ok {
					ename, _ := content["ename"].(string)
					evalue, _ := content["evalue"].(string)
					traceback, _ := content["traceback"].([]interface{})
					resultBuffer.WriteString(fmt.Sprintf("Error: %s: %s\n", ename, evalue))
					for _, tb := range traceback {
						if line, ok := tb.(string); ok {
							resultBuffer.WriteString(line)
						}
					}
					executionError = fmt.Errorf("%s: %s", ename, evalue)
				}
			case "execute_reply":
				// This message indicates execution is complete
				executeReplyReceived = true
				if content, ok := msg["content"].(map[string]interface{}); ok {
					status, _ := content["status"].(string)
					if status == "error" {
						// Error details should come in error message, but check here too
						if ename, ok := content["ename"].(string); ok {
							if evalue, ok := content["evalue"].(string); ok {
								if executionError == nil {
									executionError = fmt.Errorf("%s: %s", ename, evalue)
								}
							}
						}
					}
				}
				// Wait a bit for any remaining stream messages, then signal done
				time.Sleep(100 * time.Millisecond)
				done <- true
				return
			case "status":
				if content, ok := msg["content"].(map[string]interface{}); ok {
					if executionState, ok := content["execution_state"].(string); ok {
						// Only use status as fallback if we haven't received execute_reply
						if executionState == "idle" && executeReplyReceived {
							done <- true
							return
						}
					}
				}
			}
		}
	}()

	// 실행 요청 전송
	msgID := fmt.Sprintf("%d", time.Now().UnixNano())
	executeMsg := map[string]interface{}{
		"header": map[string]interface{}{
			"msg_id":   msgID,
			"username": "system",
			"session":  sessionID,
			"msg_type": "execute_request",
			"version":  "5.3",
		},
		"parent_header": map[string]interface{}{},
		"metadata":      map[string]interface{}{},
		"content": map[string]interface{}{
			"code":   code,
			"silent": false,
		},
	}

	msgJSON, err := json.Marshal(executeMsg)
	if err != nil {
		return "", fmt.Errorf("failed to marshal execute message: %w", err)
	}

	if err := conn.WriteMessage(websocket.TextMessage, msgJSON); err != nil {
		return "", fmt.Errorf("failed to send execute message: %w", err)
	}

	// 타임아웃 설정
	timeout := 30 * time.Second
	select {
	case <-done:
		if executionError != nil {
			return resultBuffer.String(), executionError
		}
		return resultBuffer.String(), nil
	case <-time.After(timeout):
		return resultBuffer.String(), fmt.Errorf("execution timeout after %v", timeout)
	case <-ctx.Done():
		return resultBuffer.String(), ctx.Err()
	}
}

// ExecuteCodeWithBreakpoints injects breakpoint code into Python code and executes it
func (s *JupyterService) ExecuteCodeWithBreakpoints(ctx context.Context, kernelID string, code string, breakpoints []int) (string, error) {
	// Sort breakpoints in descending order
	sortedBps := make([]int, len(breakpoints))
	copy(sortedBps, breakpoints)
	sort.Sort(sort.Reverse(sort.IntSlice(sortedBps)))

	lines := strings.Split(code, "\n")
	modifiedLines := make([]string, 0, len(lines)+len(breakpoints)*4)
	
	for i, line := range lines {
		lineNum := i + 1
		
		// Check if this line has a breakpoint
		hasBreakpoint := false
		for _, bp := range sortedBps {
			if bp == lineNum {
				hasBreakpoint = true
				break
			}
		}
		
		if hasBreakpoint {
			// Inject breakpoint code before this line
			indent := strings.Repeat(" ", len(line)-len(strings.TrimLeft(line, " ")))
			modifiedLines = append(modifiedLines, fmt.Sprintf("%s# BREAKPOINT at line %d", indent, lineNum))
			modifiedLines = append(modifiedLines, fmt.Sprintf("%s_breakpoint_vars = {k: v for k, v in locals().items() if not k.startswith('_')}", indent))
			modifiedLines = append(modifiedLines, fmt.Sprintf("%sprint(f'\\n⏸ BREAKPOINT at line {lineNum}')", indent))
			modifiedLines = append(modifiedLines, fmt.Sprintf("%sprint(f'Variables: {_breakpoint_vars}')", indent))
		}
		
		modifiedLines = append(modifiedLines, line)
	}
	
	modifiedCode := strings.Join(modifiedLines, "\n")
	return s.ExecuteCode(ctx, kernelID, modifiedCode)
}
