package models

// JupyterExecuteRequestDTO represents a request to execute Python code in Jupyter
type JupyterExecuteRequestDTO struct {
	Code     string `json:"code"`
	Username string `json:"username"`
}

// JupyterExecuteResponseDTO represents the response from Jupyter execution
type JupyterExecuteResponseDTO struct {
	Success bool   `json:"success"`
	Output  string `json:"output"`
	Error   string `json:"error,omitempty"`
}

// JupyterDebugRequestDTO represents a request to debug Python code in Jupyter
type JupyterDebugRequestDTO struct {
	Code       string  `json:"code"`
	Username   string  `json:"username"`
	Breakpoints []int  `json:"breakpoints"` // Line numbers (1-based)
}

// JupyterDebugResponseDTO represents the response from Jupyter debugging
type JupyterDebugResponseDTO struct {
	Success     bool                   `json:"success"`
	Output      string                 `json:"output"`
	Error       string                 `json:"error,omitempty"`
	Paused      bool                   `json:"paused"`      // Whether execution is paused at breakpoint
	CurrentLine int                    `json:"currentLine"` // Current line number (0 if not paused)
	Variables   map[string]interface{} `json:"variables"`   // Variable values at current breakpoint
}

// JupyterDebugControlRequestDTO represents a control command for debugging
type JupyterDebugControlRequestDTO struct {
	KernelID string `json:"kernelId"`
	Action   string `json:"action"` // "continue", "step_over", "step_into", "step_out"
}

// KernelResponse represents a Jupyter kernel response
type KernelResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
