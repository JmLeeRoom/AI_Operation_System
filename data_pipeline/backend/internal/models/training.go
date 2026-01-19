package models

import (
	"encoding/json"
	"time"
)

// ============================================================
// Training Run
// ============================================================

type TrainingRun struct {
	RunID           int64            `json:"run_id"`
	Name            string           `json:"name"`
	Description     *string          `json:"description,omitempty"`
	Status          string           `json:"status"`
	BaseModel       string           `json:"base_model"`
	ModelType       string           `json:"model_type"`
	Hyperparameters json.RawMessage  `json:"hyperparameters,omitempty"`
	DatasetID       *int64           `json:"dataset_id,omitempty"`
	DatasetVersion  *string          `json:"dataset_version,omitempty"`
	StartedAt       *time.Time       `json:"started_at,omitempty"`
	CompletedAt     *time.Time       `json:"completed_at,omitempty"`
	DurationSeconds *int             `json:"duration_seconds,omitempty"`
	OutputModelPath *string          `json:"output_model_path,omitempty"`
	Metrics         json.RawMessage  `json:"metrics,omitempty"`
	ErrorMessage    *string          `json:"error_message,omitempty"`
	GPUInfo         json.RawMessage  `json:"gpu_info,omitempty"`
	CreatedAt       time.Time        `json:"created_at"`
	CreatedBy       *int64           `json:"created_by,omitempty"`
}

type TrainingRunRequestDTO struct {
	Name            string          `json:"name"`
	Description     *string         `json:"description,omitempty"`
	BaseModel       string          `json:"base_model"`
	ModelType       string          `json:"model_type"`
	Hyperparameters json.RawMessage `json:"hyperparameters,omitempty"`
	DatasetID       *int64          `json:"dataset_id,omitempty"`
}

type TrainingRunResponseDTO struct {
	RunID   int64  `json:"run_id"`
	Name    string `json:"name"`
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

type TrainingStatusDTO struct {
	RunID           int64           `json:"run_id"`
	Status          string          `json:"status"`
	Progress        float64         `json:"progress"`  // 0-100
	CurrentEpoch    int             `json:"current_epoch,omitempty"`
	TotalEpochs     int             `json:"total_epochs,omitempty"`
	CurrentStep     int             `json:"current_step,omitempty"`
	TotalSteps      int             `json:"total_steps,omitempty"`
	TrainLoss       float64         `json:"train_loss,omitempty"`
	EvalLoss        float64         `json:"eval_loss,omitempty"`
	LearningRate    float64         `json:"learning_rate,omitempty"`
	ElapsedSeconds  int             `json:"elapsed_seconds,omitempty"`
	EstimatedETA    int             `json:"estimated_eta,omitempty"`
	GPUMemoryUsed   float64         `json:"gpu_memory_used_gb,omitempty"`
	Logs            []string        `json:"logs,omitempty"`
}

type Hyperparameters struct {
	LearningRate              float64 `json:"learning_rate"`
	NumEpochs                 int     `json:"num_epochs"`
	BatchSize                 int     `json:"batch_size"`
	GradientAccumulationSteps int     `json:"gradient_accumulation_steps"`
	LoraR                     int     `json:"lora_r"`
	LoraAlpha                 int     `json:"lora_alpha"`
	LoraDropout               float64 `json:"lora_dropout"`
	MaxSeqLength              int     `json:"max_seq_length"`
	WarmupRatio               float64 `json:"warmup_ratio"`
}

// ============================================================
// Feedback
// ============================================================

type Feedback struct {
	FeedbackID        int64      `json:"feedback_id"`
	FeedbackType      string     `json:"feedback_type"`
	InputPrompt       string     `json:"input_prompt"`
	InputCode         *string    `json:"input_code,omitempty"`
	OutputCode        *string    `json:"output_code,omitempty"`
	OutputExplanation *string    `json:"output_explanation,omitempty"`
	ExecutionSuccess  *bool      `json:"execution_success,omitempty"`
	ExecutionOutput   *string    `json:"execution_output,omitempty"`
	ExecutionError    *string    `json:"execution_error,omitempty"`
	Rating            *int       `json:"rating,omitempty"`
	IsAccepted        *bool      `json:"is_accepted,omitempty"`
	UserCorrection    *string    `json:"user_correction,omitempty"`
	SessionID         *string    `json:"session_id,omitempty"`
	NodeID            *string    `json:"node_id,omitempty"`
	FlowID            *int64     `json:"flow_id,omitempty"`
	ModelVersion      *string    `json:"model_version,omitempty"`
	UsedForTraining   bool       `json:"used_for_training"`
	DatasetID         *int64     `json:"dataset_id,omitempty"`
	CreatedAt         time.Time  `json:"created_at"`
}

type FeedbackRequestDTO struct {
	FeedbackType      string  `json:"feedback_type"`
	InputPrompt       string  `json:"input_prompt"`
	InputCode         *string `json:"input_code,omitempty"`
	OutputCode        *string `json:"output_code,omitempty"`
	OutputExplanation *string `json:"output_explanation,omitempty"`
	ExecutionSuccess  *bool   `json:"execution_success,omitempty"`
	ExecutionOutput   *string `json:"execution_output,omitempty"`
	ExecutionError    *string `json:"execution_error,omitempty"`
	Rating            *int    `json:"rating,omitempty"`
	IsAccepted        *bool   `json:"is_accepted,omitempty"`
	UserCorrection    *string `json:"user_correction,omitempty"`
	SessionID         *string `json:"session_id,omitempty"`
	NodeID            *string `json:"node_id,omitempty"`
	FlowID            *int64  `json:"flow_id,omitempty"`
	ModelVersion      *string `json:"model_version,omitempty"`
}

// ============================================================
// Dataset
// ============================================================

type Dataset struct {
	DatasetID    int64           `json:"dataset_id"`
	Name         string          `json:"name"`
	Version      string          `json:"version"`
	Description  *string         `json:"description,omitempty"`
	TotalSamples int             `json:"total_samples"`
	TrainSamples int             `json:"train_samples"`
	EvalSamples  int             `json:"eval_samples"`
	TestSamples  int             `json:"test_samples"`
	DataPath     *string         `json:"data_path,omitempty"`
	TrainFile    *string         `json:"train_file,omitempty"`
	EvalFile     *string         `json:"eval_file,omitempty"`
	TestFile     *string         `json:"test_file,omitempty"`
	Config       json.RawMessage `json:"config,omitempty"`
	Status       string          `json:"status"`
	IsActive     bool            `json:"is_active"`
	CreatedAt    time.Time       `json:"created_at"`
	CreatedBy    *int64          `json:"created_by,omitempty"`
}

type DatasetRequestDTO struct {
	Name        string          `json:"name"`
	Version     string          `json:"version"`
	Description *string         `json:"description,omitempty"`
	Config      json.RawMessage `json:"config,omitempty"`
}

type DatasetBuildRequestDTO struct {
	Name             string   `json:"name"`
	Version          string   `json:"version"`
	Description      *string  `json:"description,omitempty"`
	SourceType       string   `json:"source_type"`  // feedbacks, files, manual
	FeedbackFilters  *FeedbackFilters `json:"feedback_filters,omitempty"`
	TrainSplitRatio  float64  `json:"train_split_ratio"`  // 0.8
	EvalSplitRatio   float64  `json:"eval_split_ratio"`   // 0.1
	TestSplitRatio   float64  `json:"test_split_ratio"`   // 0.1
	DedupEnabled     bool     `json:"dedup_enabled"`
	MinSampleLength  int      `json:"min_sample_length"`
}

type FeedbackFilters struct {
	MinRating       *int    `json:"min_rating,omitempty"`
	IsAccepted      *bool   `json:"is_accepted,omitempty"`
	FeedbackTypes   []string `json:"feedback_types,omitempty"`
	FromDate        *string `json:"from_date,omitempty"`
	ToDate          *string `json:"to_date,omitempty"`
}

// ============================================================
// Model
// ============================================================

type Model struct {
	ModelID         int64           `json:"model_id"`
	Name            string          `json:"name"`
	Version         string          `json:"version"`
	Description     *string         `json:"description,omitempty"`
	BaseModel       string          `json:"base_model"`
	ModelType       string          `json:"model_type"`
	ModelPath       string          `json:"model_path"`
	AdapterPath     *string         `json:"adapter_path,omitempty"`
	MergedModelPath *string         `json:"merged_model_path,omitempty"`
	TrainingRunID   *int64          `json:"training_run_id,omitempty"`
	DatasetID       *int64          `json:"dataset_id,omitempty"`
	EvalMetrics     json.RawMessage `json:"eval_metrics,omitempty"`
	BenchmarkScores json.RawMessage `json:"benchmark_scores,omitempty"`
	IsActive        bool            `json:"is_active"`
	IsProduction    bool            `json:"is_production"`
	DeployedAt      *time.Time      `json:"deployed_at,omitempty"`
	OllamaModelName *string         `json:"ollama_model_name,omitempty"`
	OllamaImported  bool            `json:"ollama_imported"`
	CreatedAt       time.Time       `json:"created_at"`
	CreatedBy       *int64          `json:"created_by,omitempty"`
}

type ModelRequestDTO struct {
	Name        string  `json:"name"`
	Version     string  `json:"version"`
	Description *string `json:"description,omitempty"`
	BaseModel   string  `json:"base_model"`
	ModelType   string  `json:"model_type"`
	ModelPath   string  `json:"model_path"`
	AdapterPath *string `json:"adapter_path,omitempty"`
}

type ModelActivateRequestDTO struct {
	ModelID      int64  `json:"model_id"`
	OllamaName   string `json:"ollama_name,omitempty"`
	IsProduction bool   `json:"is_production"`
}

type ModelDeployResponseDTO struct {
	ModelID     int64  `json:"model_id"`
	Status      string `json:"status"`
	OllamaName  string `json:"ollama_name,omitempty"`
	Message     string `json:"message,omitempty"`
}

// ============================================================
// Evaluation
// ============================================================

type Evaluation struct {
	EvalID          int64           `json:"eval_id"`
	ModelID         int64           `json:"model_id"`
	DatasetID       *int64          `json:"dataset_id,omitempty"`
	EvalType        string          `json:"eval_type"`
	Metrics         json.RawMessage `json:"metrics"`
	Passed          *bool           `json:"passed,omitempty"`
	CodeTestsTotal  int             `json:"code_tests_total"`
	CodeTestsPassed int             `json:"code_tests_passed"`
	CodeTestsFailed int             `json:"code_tests_failed"`
	DetailedResults json.RawMessage `json:"detailed_results,omitempty"`
	CreatedAt       time.Time       `json:"created_at"`
	DurationSeconds *int            `json:"duration_seconds,omitempty"`
}

type EvaluationRequestDTO struct {
	ModelID   int64  `json:"model_id"`
	DatasetID *int64 `json:"dataset_id,omitempty"`
	EvalType  string `json:"eval_type"`
}

type EvaluationResultDTO struct {
	EvalID          int64                  `json:"eval_id"`
	ModelID         int64                  `json:"model_id"`
	Passed          bool                   `json:"passed"`
	Metrics         map[string]interface{} `json:"metrics"`
	CodeTestsPassed int                    `json:"code_tests_passed"`
	CodeTestsTotal  int                    `json:"code_tests_total"`
	PassRate        float64                `json:"pass_rate"`
	Message         string                 `json:"message,omitempty"`
}
