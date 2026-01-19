package handler

import (
	"data-pipeline-backend/internal/models"
	"data-pipeline-backend/internal/service"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func (h *Handler) ExecutePythonCode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.JupyterExecuteRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Code == "" {
		h.Error(w, http.StatusBadRequest, "Code is required")
		return
	}

	if req.Username == "" {
		req.Username = "default"
	}

	ctx := r.Context()
	jupyterService, err := service.NewJupyterService()
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create Jupyter service: %v", err))
		return
	}

	// Create kernel
	kernel, err := jupyterService.CreateKernel(ctx, req.Username)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create kernel: %v", err))
		return
	}

	// Execute code
	output, execErr := jupyterService.ExecuteCode(ctx, kernel.ID, req.Code)

	// Cleanup: delete kernel
	if deleteErr := jupyterService.DeleteKernel(ctx, kernel.ID); deleteErr != nil {
		// Log but don't fail the request
		fmt.Printf("Warning: Failed to delete kernel %s: %v\n", kernel.ID, deleteErr)
	}

	// Prepare response
	response := models.JupyterExecuteResponseDTO{
		Success: execErr == nil,
		Output:  output,
	}

	if execErr != nil {
		response.Error = execErr.Error()
		h.JSON(w, http.StatusOK, response)
		return
	}

	h.JSON(w, http.StatusOK, response)
}

func (h *Handler) DebugPythonCode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.JupyterDebugRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Code == "" {
		h.Error(w, http.StatusBadRequest, "Code is required")
		return
	}

	if req.Username == "" {
		req.Username = "default"
	}

	ctx := r.Context()
	jupyterService, err := service.NewJupyterService()
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create Jupyter service: %v", err))
		return
	}

	// Create kernel
	kernel, err := jupyterService.CreateKernel(ctx, req.Username)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create kernel: %v", err))
		return
	}

	// Execute code with breakpoints
	output, execErr := jupyterService.ExecuteCodeWithBreakpoints(ctx, kernel.ID, req.Code, req.Breakpoints)

	// Cleanup: delete kernel
	if deleteErr := jupyterService.DeleteKernel(ctx, kernel.ID); deleteErr != nil {
		fmt.Printf("Warning: Failed to delete kernel %s: %v\n", kernel.ID, deleteErr)
	}

	// Parse response to extract breakpoint info
	response := models.JupyterDebugResponseDTO{
		Success:   execErr == nil,
		Output:    output,
		Paused:    false,
		Variables: make(map[string]interface{}),
	}

	if execErr != nil {
		response.Error = execErr.Error()
	}

	// Check if execution paused at breakpoint
	if strings.Contains(output, "⏸ BREAKPOINT") {
		response.Paused = true
		// Extract line number from output
		for _, bp := range req.Breakpoints {
			if strings.Contains(output, fmt.Sprintf("line %d", bp)) {
				response.CurrentLine = bp
				break
			}
		}
	}

	h.JSON(w, http.StatusOK, response)
}

func (h *Handler) DebugSessionControl(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.DebugSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	ctx := r.Context()
	debugService, err := service.GetDebugSessionService()
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to get debug service: %v", err))
		return
	}

	var response *models.DebugSessionResponse

	switch req.Action {
	case "start":
		if req.Code == "" {
			h.Error(w, http.StatusBadRequest, "Code is required for start action")
			return
		}
		response, err = debugService.StartSession(ctx, req.Code, req.Breakpoints, "default")
	case "continue":
		if req.SessionID == "" {
			h.Error(w, http.StatusBadRequest, "SessionID is required for continue action")
			return
		}
		response, err = debugService.ContinueSession(ctx, req.SessionID)
	case "step_over":
		if req.SessionID == "" {
			h.Error(w, http.StatusBadRequest, "SessionID is required for step_over action")
			return
		}
		response, err = debugService.StepOver(ctx, req.SessionID)
	case "step_into":
		if req.SessionID == "" {
			h.Error(w, http.StatusBadRequest, "SessionID is required for step_into action")
			return
		}
		response, err = debugService.StepInto(ctx, req.SessionID)
	case "step_out":
		if req.SessionID == "" {
			h.Error(w, http.StatusBadRequest, "SessionID is required for step_out action")
			return
		}
		response, err = debugService.StepOut(ctx, req.SessionID)
	case "set_variable":
		if req.SessionID == "" || req.Variable == "" || req.Value == "" {
			h.Error(w, http.StatusBadRequest, "SessionID, variable, and value are required for set_variable action")
			return
		}
		response, err = debugService.SetVariable(ctx, req.SessionID, req.Variable, req.Value)
	case "get_session":
		if req.SessionID == "" {
			h.Error(w, http.StatusBadRequest, "SessionID is required for get_session action")
			return
		}
		session, getErr := debugService.GetSession(req.SessionID)
		if getErr != nil {
			h.Error(w, http.StatusNotFound, getErr.Error())
			return
		}
		response = &models.DebugSessionResponse{
			Success:     true,
			SessionID:   session.SessionID,
			CurrentLine: session.CurrentLine,
			Variables:   session.Variables,
			CallStack:   session.CallStack,
			IsPaused:    session.IsPaused,
			IsFinished:  session.IsFinished,
			Output:      session.Output,
		}
		h.JSON(w, http.StatusOK, response)
		return
	default:
		h.Error(w, http.StatusBadRequest, fmt.Sprintf("Unknown action: %s", req.Action))
		return
	}

	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Debug operation failed: %v", err))
		return
	}

	h.JSON(w, http.StatusOK, response)
}

func (h *Handler) DeleteDebugSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	sessionID := r.URL.Query().Get("sessionId")
	if sessionID == "" {
		h.Error(w, http.StatusBadRequest, "sessionId query parameter is required")
		return
	}

	ctx := r.Context()
	debugService, err := service.GetDebugSessionService()
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to get debug service: %v", err))
		return
	}

	if err := debugService.DeleteSession(ctx, sessionID); err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to delete session: %v", err))
		return
	}

	h.JSON(w, http.StatusOK, map[string]string{"message": "Session deleted"})
}
