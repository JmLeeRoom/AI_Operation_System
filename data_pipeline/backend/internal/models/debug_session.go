package models

// DebugSession represents an active debugging session
type DebugSession struct {
	SessionID    string                 `json:"sessionId"`
	KernelID     string                 `json:"kernelId"`
	Code         string                 `json:"code"`
	Breakpoints  []int                  `json:"breakpoints"`
	CurrentLine  int                    `json:"currentLine"`
	Variables    map[string]interface{} `json:"variables"`
	CallStack    []StackFrame           `json:"callStack"`
	IsPaused     bool                   `json:"isPaused"`
	IsFinished   bool                   `json:"isFinished"`
	Output       string                 `json:"output"`
}

// StackFrame represents a frame in the call stack
type StackFrame struct {
	Name     string                 `json:"name"`
	File     string                 `json:"file"`
	Line     int                    `json:"line"`
	Variables map[string]interface{} `json:"variables"`
}

// DebugSessionRequest represents a request to create or control a debug session
type DebugSessionRequest struct {
	SessionID   string `json:"sessionId,omitempty"`   // For continuing existing session
	Code        string `json:"code,omitempty"`         // For new session
	Breakpoints []int  `json:"breakpoints,omitempty"` // For new session
	Action      string `json:"action"`                 // "start", "continue", "step_over", "step_into", "step_out", "set_variable"
	Variable    string `json:"variable,omitempty"`     // For set_variable action
	Value       string `json:"value,omitempty"`        // For set_variable action
}

// DebugSessionResponse represents the response from a debug session operation
type DebugSessionResponse struct {
	Success     bool                   `json:"success"`
	SessionID   string                 `json:"sessionId,omitempty"`
	CurrentLine int                    `json:"currentLine"`
	Variables   map[string]interface{} `json:"variables"`
	CallStack   []StackFrame           `json:"callStack"`
	Output      string                 `json:"output"`
	IsPaused    bool                   `json:"isPaused"`
	IsFinished  bool                   `json:"isFinished"`
	Error       string                 `json:"error,omitempty"`
}
