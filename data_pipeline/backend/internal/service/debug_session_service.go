package service

import (
	"context"
	"data-pipeline-backend/internal/models"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"
)

// DebugSessionService manages debugging sessions
type DebugSessionService struct {
	sessions map[string]*models.DebugSession
	mu       sync.RWMutex
	jupyter  *JupyterService
}

var (
	globalDebugSessionService *DebugSessionService
	debugSessionServiceOnce   sync.Once
)

// GetDebugSessionService returns the global debug session service
func GetDebugSessionService() (*DebugSessionService, error) {
	debugSessionServiceOnce.Do(func() {
		jupyter, err := NewJupyterService()
		if err != nil {
			// Will be handled on first use
			return
		}
		globalDebugSessionService = &DebugSessionService{
			sessions: make(map[string]*models.DebugSession),
			jupyter:   jupyter,
		}
	})
	
	if globalDebugSessionService == nil {
		jupyter, err := NewJupyterService()
		if err != nil {
			return nil, fmt.Errorf("failed to create Jupyter service: %w", err)
		}
		globalDebugSessionService = &DebugSessionService{
			sessions: make(map[string]*models.DebugSession),
			jupyter:   jupyter,
		}
	}
	
	return globalDebugSessionService, nil
}

// StartSession starts a new debugging session
func (s *DebugSessionService) StartSession(ctx context.Context, code string, breakpoints []int, username string) (*models.DebugSessionResponse, error) {
	// Create kernel
	kernel, err := s.jupyter.CreateKernel(ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to create kernel: %w", err)
	}

	sessionID := fmt.Sprintf("debug_%d", time.Now().UnixNano())
	
	session := &models.DebugSession{
		SessionID:   sessionID,
		KernelID:    kernel.ID,
		Code:        code,
		Breakpoints: breakpoints,
		CurrentLine: 0,
		Variables:   make(map[string]interface{}),
		CallStack:   []models.StackFrame{},
		IsPaused:    false,
		IsFinished:  false,
		Output:      "",
	}

	s.mu.Lock()
	s.sessions[sessionID] = session
	s.mu.Unlock()

	// Start execution
	return s.executeToNextBreakpoint(ctx, session)
}

// ContinueSession continues execution from current position
func (s *DebugSessionService) ContinueSession(ctx context.Context, sessionID string) (*models.DebugSessionResponse, error) {
	s.mu.RLock()
	session, exists := s.sessions[sessionID]
	s.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("session not found: %s", sessionID)
	}

	if session.IsFinished {
		return &models.DebugSessionResponse{
			Success:    true,
			SessionID:  sessionID,
			IsFinished: true,
			Output:     session.Output,
		}, nil
	}

	return s.executeToNextBreakpoint(ctx, session)
}

// StepOver executes the current line and stops at the next line
func (s *DebugSessionService) StepOver(ctx context.Context, sessionID string) (*models.DebugSessionResponse, error) {
	s.mu.RLock()
	session, exists := s.sessions[sessionID]
	s.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("session not found: %s", sessionID)
	}

	return s.executeNextLine(ctx, session)
}

// StepInto steps into function calls
func (s *DebugSessionService) StepInto(ctx context.Context, sessionID string) (*models.DebugSessionResponse, error) {
	// For now, same as StepOver
	// In a full implementation, this would track function calls
	return s.StepOver(ctx, sessionID)
}

// StepOut steps out of current function
func (s *DebugSessionService) StepOut(ctx context.Context, sessionID string) (*models.DebugSessionResponse, error) {
	// For now, continue to next breakpoint
	// In a full implementation, this would track call stack
	return s.ContinueSession(ctx, sessionID)
}

// SetVariable sets a variable value in the current scope
func (s *DebugSessionService) SetVariable(ctx context.Context, sessionID string, variable string, value string) (*models.DebugSessionResponse, error) {
	s.mu.RLock()
	session, exists := s.sessions[sessionID]
	s.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("session not found: %s", sessionID)
	}

	if !session.IsPaused {
		return nil, fmt.Errorf("session is not paused")
	}

	// Execute code to set variable
	setCode := fmt.Sprintf("%s = %s", variable, value)
	output, err := s.jupyter.ExecuteCode(ctx, session.KernelID, setCode)
	if err != nil {
		return nil, fmt.Errorf("failed to set variable: %w", err)
	}

	// Update variables
	s.mu.Lock()
	// Re-fetch variables after setting
	varCode := fmt.Sprintf(`
import json
_vars = {k: v for k, v in locals().items() if not k.startswith('_')}
print(json.dumps(_vars))
`)
	_, _ = s.jupyter.ExecuteCode(ctx, session.KernelID, varCode)
	// Parse variables from output (simplified)
	session.Output += output
	s.mu.Unlock()

	return &models.DebugSessionResponse{
		Success:     true,
		SessionID:   sessionID,
		CurrentLine: session.CurrentLine,
		Variables:   session.Variables,
		CallStack:   session.CallStack,
		IsPaused:    true,
		Output:      session.Output,
	}, nil
}

// GetSession returns the current state of a debug session
func (s *DebugSessionService) GetSession(sessionID string) (*models.DebugSession, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	session, exists := s.sessions[sessionID]
	if !exists {
		return nil, fmt.Errorf("session not found: %s", sessionID)
	}

	return session, nil
}

// DeleteSession deletes a debug session and cleans up the kernel
func (s *DebugSessionService) DeleteSession(ctx context.Context, sessionID string) error {
	s.mu.Lock()
	session, exists := s.sessions[sessionID]
	if exists {
		delete(s.sessions, sessionID)
	}
	s.mu.Unlock()

	if exists && session.KernelID != "" {
		return s.jupyter.DeleteKernel(ctx, session.KernelID)
	}

	return nil
}

// executeToNextBreakpoint executes code until the next breakpoint
func (s *DebugSessionService) executeToNextBreakpoint(ctx context.Context, session *models.DebugSession) (*models.DebugSessionResponse, error) {
	lines := strings.Split(session.Code, "\n")
	startLine := session.CurrentLine
	
	// Find next breakpoint
	nextBreakpoint := -1
	for _, bp := range session.Breakpoints {
		if bp > startLine && (nextBreakpoint == -1 || bp < nextBreakpoint) {
			nextBreakpoint = bp
		}
	}

	if nextBreakpoint == -1 {
		// No more breakpoints, execute remaining code
		return s.executeRemainingCode(ctx, session)
	}

	// Execute code up to next breakpoint
	codeToExecute := strings.Join(lines[startLine:nextBreakpoint], "\n")
	output, err := s.jupyter.ExecuteCode(ctx, session.KernelID, codeToExecute)
	
	s.mu.Lock()
	session.Output += output
	session.CurrentLine = nextBreakpoint
	session.IsPaused = true
	
	// Get variables at breakpoint
	varCode := `
import json
_vars = {k: str(v) for k, v in locals().items() if not k.startswith('_')}
print("__VARS_START__")
print(json.dumps(_vars))
print("__VARS_END__")
`
	varOutput, _ := s.jupyter.ExecuteCode(ctx, session.KernelID, varCode)
	// Parse variables
	if strings.Contains(varOutput, "__VARS_START__") && strings.Contains(varOutput, "__VARS_END__") {
		startIdx := strings.Index(varOutput, "__VARS_START__") + len("__VARS_START__")
		endIdx := strings.Index(varOutput, "__VARS_END__")
		if startIdx < endIdx {
			jsonStr := strings.TrimSpace(varOutput[startIdx:endIdx])
			var vars map[string]interface{}
			if err := json.Unmarshal([]byte(jsonStr), &vars); err == nil {
				session.Variables = vars
			}
		}
	}
	
	s.mu.Unlock()

	if err != nil {
		return &models.DebugSessionResponse{
			Success:    false,
			SessionID:  session.SessionID,
			Error:      err.Error(),
			Output:     session.Output,
			IsPaused:   false,
			IsFinished: true,
		}, nil
	}

	return &models.DebugSessionResponse{
		Success:     true,
		SessionID:   session.SessionID,
		CurrentLine: session.CurrentLine,
		Variables:   session.Variables,
		CallStack:   session.CallStack,
		IsPaused:    true,
		Output:      session.Output,
	}, nil
}

// executeNextLine executes the next line of code
func (s *DebugSessionService) executeNextLine(ctx context.Context, session *models.DebugSession) (*models.DebugSessionResponse, error) {
	lines := strings.Split(session.Code, "\n")
	
	if session.CurrentLine >= len(lines) {
		s.mu.Lock()
		session.IsFinished = true
		session.IsPaused = false
		s.mu.Unlock()
		
		return &models.DebugSessionResponse{
			Success:    true,
			SessionID: session.SessionID,
			IsFinished: true,
			Output:     session.Output,
		}, nil
	}

	// Execute current line
	lineToExecute := lines[session.CurrentLine]
	output, err := s.jupyter.ExecuteCode(ctx, session.KernelID, lineToExecute)
	
	s.mu.Lock()
	session.Output += output
	session.CurrentLine++
	
	// Check if we hit a breakpoint
	hitBreakpoint := false
	for _, bp := range session.Breakpoints {
		if bp == session.CurrentLine {
			hitBreakpoint = true
			break
		}
	}
	
	session.IsPaused = hitBreakpoint
	
	// Get variables
	varCode := `
import json
_vars = {k: str(v) for k, v in locals().items() if not k.startswith('_')}
print("__VARS_START__")
print(json.dumps(_vars))
print("__VARS_END__")
`
	varOutput, _ := s.jupyter.ExecuteCode(ctx, session.KernelID, varCode)
	// Parse variables
	if strings.Contains(varOutput, "__VARS_START__") && strings.Contains(varOutput, "__VARS_END__") {
		startIdx := strings.Index(varOutput, "__VARS_START__") + len("__VARS_START__")
		endIdx := strings.Index(varOutput, "__VARS_END__")
		if startIdx < endIdx {
			jsonStr := strings.TrimSpace(varOutput[startIdx:endIdx])
			var vars map[string]interface{}
			if err := json.Unmarshal([]byte(jsonStr), &vars); err == nil {
				session.Variables = vars
			}
		}
	}
	
	s.mu.Unlock()

	if err != nil {
		return &models.DebugSessionResponse{
			Success:    false,
			SessionID:  session.SessionID,
			Error:      err.Error(),
			Output:     session.Output,
			IsPaused:   false,
			IsFinished: true,
		}, nil
	}

	return &models.DebugSessionResponse{
		Success:     true,
		SessionID:   session.SessionID,
		CurrentLine: session.CurrentLine,
		Variables:   session.Variables,
		CallStack:   session.CallStack,
		IsPaused:    session.IsPaused,
		IsFinished:  session.IsFinished,
		Output:      session.Output,
	}, nil
}

// executeRemainingCode executes all remaining code
func (s *DebugSessionService) executeRemainingCode(ctx context.Context, session *models.DebugSession) (*models.DebugSessionResponse, error) {
	lines := strings.Split(session.Code, "\n")
	codeToExecute := strings.Join(lines[session.CurrentLine:], "\n")
	
	output, err := s.jupyter.ExecuteCode(ctx, session.KernelID, codeToExecute)
	
	s.mu.Lock()
	session.Output += output
	session.CurrentLine = len(lines)
	session.IsFinished = true
	session.IsPaused = false
	s.mu.Unlock()

	if err != nil {
		return &models.DebugSessionResponse{
			Success:    false,
			SessionID:  session.SessionID,
			Error:      err.Error(),
			Output:     session.Output,
			IsFinished: true,
		}, nil
	}

	return &models.DebugSessionResponse{
		Success:    true,
		SessionID:  session.SessionID,
		IsFinished: true,
		Output:     session.Output,
	}, nil
}
