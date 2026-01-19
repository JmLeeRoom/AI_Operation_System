package models

// K8sRequestDTO represents the request payload for K8s operations
type K8sRequestDTO struct {
	User      string   `json:"user"`
	FlowID    string   `json:"flowId"`
	Steps     []int64  `json:"steps"`
	Test      *int64   `json:"test,omitempty"`
	TestInput *string  `json:"testInput,omitempty"`
}

// ProgressEventDTO represents SSE progress event payload
type ProgressEventDTO struct {
	Phase   string                 `json:"phase"`
	Message string                 `json:"message"`
	OK      bool                   `json:"ok"`
	Data    map[string]interface{} `json:"data,omitempty"`
}
