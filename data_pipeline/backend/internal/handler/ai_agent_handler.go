package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type AIAgentRequest struct {
	Code        string `json:"code"`
	Instruction string `json:"instruction"`
	Action      string `json:"action"` // "generate", "modify", "explain"
}

type AIAgentResponse struct {
	Success bool   `json:"success"`
	Code    string `json:"code"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

type OllamaRequest struct {
	Model    string    `json:"model"`
	Prompt   string    `json:"prompt"`
	Stream   bool      `json:"stream"`
	Messages []Message `json:"messages,omitempty"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OllamaResponse struct {
	Model     string `json:"model"`
	CreatedAt string `json:"created_at"`
	Response  string `json:"response"`
	Done      bool   `json:"done"`
}

func (h *Handler) GenerateCode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req AIAgentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Instruction == "" {
		h.Error(w, http.StatusBadRequest, "Instruction is required")
		return
	}

	// Get Ollama URL from environment or use default
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://ollama-service:11434"
	}

	// Build prompt based on action
	var prompt string
	switch req.Action {
	case "generate":
		prompt = fmt.Sprintf("You are a Python code generation assistant. Generate Python code based on the following instruction:\n\n%s\n\nRequirements:\n- Generate clean, well-commented Python code\n- Follow Python best practices\n- Include error handling where appropriate\n- Return only the code, no explanations unless asked", req.Instruction)
	case "modify":
		prompt = fmt.Sprintf("You are a Python code modification assistant. Modify the following Python code based on the instruction:\n\nCurrent code:\n```python\n%s\n```\n\nInstruction: %s\n\nRequirements:\n- Modify the code according to the instruction\n- Preserve existing functionality unless instructed otherwise\n- Return the complete modified code\n- Include comments explaining changes", req.Code, req.Instruction)
	case "explain":
		prompt = fmt.Sprintf("You are a Python code explanation assistant. Explain the following code:\n\n```python\n%s\n```\n\nProvide a clear explanation of what this code does, how it works, and any important details.", req.Code)
	default:
		prompt = fmt.Sprintf("You are a Python code assistant. %s\n\nCurrent code:\n```python\n%s\n```\n\nProvide the requested code or modification.", req.Instruction, req.Code)
	}

	// Call Ollama API
	ollamaReq := OllamaRequest{
		Model:  "qwen2.5-coder:7b",
		Prompt: prompt,
		Stream: false,
	}

	jsonData, err := json.Marshal(ollamaReq)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to marshal request: %v", err))
		return
	}

	client := &http.Client{
		Timeout: 120 * time.Second, // 2 minutes timeout for code generation
	}

	resp, err := client.Post(
		fmt.Sprintf("%s/api/generate", ollamaURL),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to connect to Ollama: %v", err))
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Ollama API error: %s", string(body)))
		return
	}

	// Parse response
	var ollamaResp OllamaResponse
	if err := json.NewDecoder(resp.Body).Decode(&ollamaResp); err != nil {
		h.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to parse Ollama response: %v", err))
		return
	}

	// Extract code from response (remove markdown code blocks if present)
	generatedCode := ollamaResp.Response
	if len(generatedCode) > 0 {
		// Remove ```python and ``` markers if present
		generatedCode = removeCodeBlocks(generatedCode)
	}

	h.JSON(w, http.StatusOK, AIAgentResponse{
		Success: true,
		Code:    generatedCode,
		Message: "Code generated successfully",
	})
}

// Helper function to remove markdown code blocks
func removeCodeBlocks(code string) string {
	// Remove ```python at the start
	if len(code) > 7 && code[:7] == "```python" {
		code = code[7:]
	} else if len(code) > 3 && code[:3] == "```" {
		code = code[3:]
	}

	// Remove ``` at the end
	if len(code) > 3 && code[len(code)-3:] == "```" {
		code = code[:len(code)-3]
	}

	// Trim whitespace
	code = trimLines(code)
	return code
}

func trimLines(s string) string {
	lines := []rune(s)
	start := 0
	end := len(lines)

	// Trim leading newlines
	for start < end && (lines[start] == '\n' || lines[start] == '\r') {
		start++
	}

	// Trim trailing newlines
	for end > start && (lines[end-1] == '\n' || lines[end-1] == '\r') {
		end--
	}

	return string(lines[start:end])
}
