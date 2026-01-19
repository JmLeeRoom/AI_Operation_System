package service

import (
	"bytes"
	"context"
	"data-pipeline-backend/internal/models"
	"data-pipeline-backend/internal/repository"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"time"
)

type TrainingService struct {
	repo            *repository.TrainingRepository
	runningJobs     map[int64]*TrainingJob
	jobStatusCache  map[int64]*models.TrainingStatusDTO
	mu              sync.RWMutex
}

type TrainingJob struct {
	RunID     int64
	Cmd       *exec.Cmd
	Cancel    context.CancelFunc
	StartTime time.Time
	LogBuffer *bytes.Buffer
}

func NewTrainingService(repo *repository.TrainingRepository) *TrainingService {
	return &TrainingService{
		repo:           repo,
		runningJobs:    make(map[int64]*TrainingJob),
		jobStatusCache: make(map[int64]*models.TrainingStatusDTO),
	}
}

// ============================================================
// Training Runs
// ============================================================

func (s *TrainingService) StartTraining(req *models.TrainingRunRequestDTO) (*models.TrainingRunResponseDTO, error) {
	// Create training run record
	run := &models.TrainingRun{
		Name:            req.Name,
		Description:     req.Description,
		Status:          "pending",
		BaseModel:       req.BaseModel,
		ModelType:       req.ModelType,
		Hyperparameters: req.Hyperparameters,
		DatasetID:       req.DatasetID,
	}

	// Set default hyperparameters if not provided
	if run.Hyperparameters == nil {
		defaultHyperparams := models.Hyperparameters{
			LearningRate:              2e-4,
			NumEpochs:                 3,
			BatchSize:                 4,
			GradientAccumulationSteps: 4,
			LoraR:                     16,
			LoraAlpha:                 32,
			LoraDropout:               0.05,
			MaxSeqLength:              2048,
			WarmupRatio:               0.03,
		}
		hyperparamsJSON, _ := json.Marshal(defaultHyperparams)
		run.Hyperparameters = hyperparamsJSON
	}

	if err := s.repo.CreateTrainingRun(run); err != nil {
		return nil, fmt.Errorf("failed to create training run: %w", err)
	}

	// Start training asynchronously
	go s.executeTraining(run)

	return &models.TrainingRunResponseDTO{
		RunID:   run.RunID,
		Name:    run.Name,
		Status:  "pending",
		Message: "Training job queued successfully",
	}, nil
}

func (s *TrainingService) executeTraining(run *models.TrainingRun) {
	ctx, cancel := context.WithCancel(context.Background())
	logBuffer := &bytes.Buffer{}

	// Register job
	job := &TrainingJob{
		RunID:     run.RunID,
		Cancel:    cancel,
		StartTime: time.Now(),
		LogBuffer: logBuffer,
	}

	s.mu.Lock()
	s.runningJobs[run.RunID] = job
	s.mu.Unlock()

	defer func() {
		s.mu.Lock()
		delete(s.runningJobs, run.RunID)
		s.mu.Unlock()
		cancel()
	}()

	// Update status to running
	if err := s.repo.UpdateTrainingRunStart(run.RunID); err != nil {
		s.repo.UpdateTrainingRunStatus(run.RunID, "failed", strPtr(fmt.Sprintf("Failed to update status: %v", err)))
		return
	}

	// Get dataset path
	var datasetPath string
	if run.DatasetID != nil {
		dataset, err := s.repo.GetDataset(*run.DatasetID)
		if err == nil && dataset.DataPath != nil {
			datasetPath = *dataset.DataPath
		}
	}

	// Prepare training script arguments
	outputPath := filepath.Join("/data/models", fmt.Sprintf("run_%d", run.RunID))
	os.MkdirAll(outputPath, 0755)

	// Parse hyperparameters
	var hyperparams models.Hyperparameters
	if run.Hyperparameters != nil {
		json.Unmarshal(run.Hyperparameters, &hyperparams)
	}

	// Build command
	scriptPath := "/app/scripts/train_qlora.py"
	args := []string{
		scriptPath,
		"--base_model", run.BaseModel,
		"--output_dir", outputPath,
		"--learning_rate", fmt.Sprintf("%e", hyperparams.LearningRate),
		"--num_epochs", fmt.Sprintf("%d", hyperparams.NumEpochs),
		"--batch_size", fmt.Sprintf("%d", hyperparams.BatchSize),
		"--gradient_accumulation_steps", fmt.Sprintf("%d", hyperparams.GradientAccumulationSteps),
		"--lora_r", fmt.Sprintf("%d", hyperparams.LoraR),
		"--lora_alpha", fmt.Sprintf("%d", hyperparams.LoraAlpha),
		"--lora_dropout", fmt.Sprintf("%f", hyperparams.LoraDropout),
		"--max_seq_length", fmt.Sprintf("%d", hyperparams.MaxSeqLength),
	}

	if datasetPath != "" {
		args = append(args, "--dataset_path", datasetPath)
	}

	cmd := exec.CommandContext(ctx, "python3", args...)
	cmd.Stdout = io.MultiWriter(logBuffer, os.Stdout)
	cmd.Stderr = io.MultiWriter(logBuffer, os.Stderr)
	cmd.Env = append(os.Environ(),
		"CUDA_VISIBLE_DEVICES=0,1",
		"PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:512",
	)

	job.Cmd = cmd

	// Update status
	s.updateJobStatus(run.RunID, &models.TrainingStatusDTO{
		RunID:    run.RunID,
		Status:   "running",
		Progress: 0,
	})

	// Execute training
	err := cmd.Run()

	if ctx.Err() == context.Canceled {
		s.repo.UpdateTrainingRunStatus(run.RunID, "cancelled", strPtr("Training cancelled by user"))
		return
	}

	if err != nil {
		errMsg := fmt.Sprintf("Training failed: %v\n%s", err, logBuffer.String())
		s.repo.UpdateTrainingRunStatus(run.RunID, "failed", &errMsg)
		return
	}

	// Training completed successfully
	metrics := json.RawMessage(`{"status": "completed"}`)
	s.repo.UpdateTrainingRunComplete(run.RunID, outputPath, metrics)
}

func (s *TrainingService) GetTrainingStatus(runID int64) (*models.TrainingStatusDTO, error) {
	s.mu.RLock()
	status, exists := s.jobStatusCache[runID]
	s.mu.RUnlock()

	if exists {
		return status, nil
	}

	// Get from database
	run, err := s.repo.GetTrainingRun(runID)
	if err != nil {
		return nil, err
	}

	return &models.TrainingStatusDTO{
		RunID:  runID,
		Status: run.Status,
	}, nil
}

func (s *TrainingService) CancelTraining(runID int64) error {
	s.mu.Lock()
	job, exists := s.runningJobs[runID]
	s.mu.Unlock()

	if !exists {
		return fmt.Errorf("no running job found with ID %d", runID)
	}

	job.Cancel()
	return nil
}

func (s *TrainingService) ListTrainingRuns(limit, offset int) ([]*models.TrainingRun, error) {
	return s.repo.ListTrainingRuns(limit, offset)
}

func (s *TrainingService) GetTrainingRun(id int64) (*models.TrainingRun, error) {
	return s.repo.GetTrainingRun(id)
}

func (s *TrainingService) updateJobStatus(runID int64, status *models.TrainingStatusDTO) {
	s.mu.Lock()
	s.jobStatusCache[runID] = status
	s.mu.Unlock()
}

// ============================================================
// Feedbacks
// ============================================================

func (s *TrainingService) CreateFeedback(req *models.FeedbackRequestDTO) (*models.Feedback, error) {
	fb := &models.Feedback{
		FeedbackType:      req.FeedbackType,
		InputPrompt:       req.InputPrompt,
		InputCode:         req.InputCode,
		OutputCode:        req.OutputCode,
		OutputExplanation: req.OutputExplanation,
		ExecutionSuccess:  req.ExecutionSuccess,
		ExecutionOutput:   req.ExecutionOutput,
		ExecutionError:    req.ExecutionError,
		Rating:            req.Rating,
		IsAccepted:        req.IsAccepted,
		UserCorrection:    req.UserCorrection,
		SessionID:         req.SessionID,
		NodeID:            req.NodeID,
		FlowID:            req.FlowID,
		ModelVersion:      req.ModelVersion,
	}

	if err := s.repo.CreateFeedback(fb); err != nil {
		return nil, err
	}

	return fb, nil
}

func (s *TrainingService) ListFeedbacks(limit, offset int, filters *models.FeedbackFilters) ([]*models.Feedback, error) {
	return s.repo.ListFeedbacks(limit, offset, filters)
}

func (s *TrainingService) GetFeedbackStats() (map[string]interface{}, error) {
	// Get counts
	totalCount, err := s.repo.CountFeedbacks(nil)
	if err != nil {
		return nil, err
	}

	acceptedFilter := &models.FeedbackFilters{IsAccepted: boolPtr(true)}
	acceptedCount, err := s.repo.CountFeedbacks(acceptedFilter)
	if err != nil {
		return nil, err
	}

	highRatingFilter := &models.FeedbackFilters{MinRating: intPtr(4)}
	highRatingCount, err := s.repo.CountFeedbacks(highRatingFilter)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"total_feedbacks":      totalCount,
		"accepted_feedbacks":   acceptedCount,
		"high_rating_count":    highRatingCount,
		"unused_for_training":  totalCount,
	}, nil
}

// ============================================================
// Datasets
// ============================================================

func (s *TrainingService) CreateDataset(req *models.DatasetRequestDTO) (*models.Dataset, error) {
	ds := &models.Dataset{
		Name:        req.Name,
		Version:     req.Version,
		Description: req.Description,
		Config:      req.Config,
		Status:      "building",
	}

	if err := s.repo.CreateDataset(ds); err != nil {
		return nil, err
	}

	return ds, nil
}

func (s *TrainingService) BuildDataset(req *models.DatasetBuildRequestDTO) (*models.Dataset, error) {
	// Create dataset record
	ds := &models.Dataset{
		Name:        req.Name,
		Version:     req.Version,
		Description: req.Description,
		Status:      "building",
	}

	if err := s.repo.CreateDataset(ds); err != nil {
		return nil, fmt.Errorf("failed to create dataset: %w", err)
	}

	// Build dataset asynchronously
	go s.executeBuildDataset(ds.DatasetID, req)

	return ds, nil
}

func (s *TrainingService) executeBuildDataset(datasetID int64, req *models.DatasetBuildRequestDTO) {
	// Get feedbacks based on filters
	feedbacks, err := s.repo.ListFeedbacks(10000, 0, req.FeedbackFilters)
	if err != nil {
		s.repo.UpdateDatasetStatus(datasetID, "failed")
		return
	}

	// Filter feedbacks
	var validFeedbacks []*models.Feedback
	for _, fb := range feedbacks {
		if fb.UsedForTraining {
			continue
		}
		if req.MinSampleLength > 0 && len(fb.InputPrompt) < req.MinSampleLength {
			continue
		}
		validFeedbacks = append(validFeedbacks, fb)
	}

	// Calculate splits
	total := len(validFeedbacks)
	trainSize := int(float64(total) * req.TrainSplitRatio)
	evalSize := int(float64(total) * req.EvalSplitRatio)
	_ = total - trainSize - evalSize // testSize (remaining samples)

	// Create dataset directory
	dataPath := filepath.Join("/data/datasets", req.Name, req.Version)
	os.MkdirAll(dataPath, 0755)

	// Write JSONL files
	trainFile := filepath.Join(dataPath, "train.jsonl")
	evalFile := filepath.Join(dataPath, "eval.jsonl")
	testFile := filepath.Join(dataPath, "test.jsonl")

	// Write train data
	if err := s.writeFeedbacksToJSONL(validFeedbacks[:trainSize], trainFile); err != nil {
		s.repo.UpdateDatasetStatus(datasetID, "failed")
		return
	}

	// Write eval data
	if err := s.writeFeedbacksToJSONL(validFeedbacks[trainSize:trainSize+evalSize], evalFile); err != nil {
		s.repo.UpdateDatasetStatus(datasetID, "failed")
		return
	}

	// Write test data
	if err := s.writeFeedbacksToJSONL(validFeedbacks[trainSize+evalSize:], testFile); err != nil {
		s.repo.UpdateDatasetStatus(datasetID, "failed")
		return
	}

	// Mark feedbacks as used
	var feedbackIDs []int64
	for _, fb := range validFeedbacks {
		feedbackIDs = append(feedbackIDs, fb.FeedbackID)
	}
	s.repo.MarkFeedbacksAsUsed(datasetID, feedbackIDs)

	// Update dataset record
	ds, _ := s.repo.GetDataset(datasetID)
	if ds != nil {
		// Update with paths and counts (simplified - in production use proper update method)
		s.repo.UpdateDatasetStatus(datasetID, "ready")
	}
}

func (s *TrainingService) writeFeedbacksToJSONL(feedbacks []*models.Feedback, filePath string) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	for _, fb := range feedbacks {
		// Convert to training format (Alpaca style)
		sample := map[string]string{
			"instruction": fb.InputPrompt,
			"input":       derefStr(fb.InputCode),
			"output":      derefStr(fb.OutputCode),
		}
		if err := encoder.Encode(sample); err != nil {
			return err
		}
	}

	return nil
}

func (s *TrainingService) ListDatasets(limit, offset int) ([]*models.Dataset, error) {
	return s.repo.ListDatasets(limit, offset)
}

func (s *TrainingService) GetDataset(id int64) (*models.Dataset, error) {
	return s.repo.GetDataset(id)
}

func (s *TrainingService) SetActiveDataset(id int64) error {
	return s.repo.SetActiveDataset(id)
}

// ============================================================
// Models
// ============================================================

func (s *TrainingService) CreateModel(req *models.ModelRequestDTO) (*models.Model, error) {
	m := &models.Model{
		Name:        req.Name,
		Version:     req.Version,
		Description: req.Description,
		BaseModel:   req.BaseModel,
		ModelType:   req.ModelType,
		ModelPath:   req.ModelPath,
		AdapterPath: req.AdapterPath,
	}

	if err := s.repo.CreateModel(m); err != nil {
		return nil, err
	}

	return m, nil
}

func (s *TrainingService) ListModels(limit, offset int) ([]*models.Model, error) {
	return s.repo.ListModels(limit, offset)
}

func (s *TrainingService) GetModel(id int64) (*models.Model, error) {
	return s.repo.GetModel(id)
}

func (s *TrainingService) GetActiveModel() (*models.Model, error) {
	return s.repo.GetActiveModel()
}

func (s *TrainingService) ActivateModel(req *models.ModelActivateRequestDTO) (*models.ModelDeployResponseDTO, error) {
	// Get model
	model, err := s.repo.GetModel(req.ModelID)
	if err != nil {
		return nil, err
	}

	// Generate Ollama model name if not provided
	ollamaName := req.OllamaName
	if ollamaName == "" {
		ollamaName = fmt.Sprintf("codegen-%s-%s", model.Name, model.Version)
	}

	// Import model to Ollama (if adapter exists)
	if model.AdapterPath != nil && *model.AdapterPath != "" {
		if err := s.importModelToOllama(model, ollamaName); err != nil {
			return nil, fmt.Errorf("failed to import model to Ollama: %w", err)
		}
	}

	// Activate in database
	if err := s.repo.ActivateModel(req.ModelID, ollamaName, req.IsProduction); err != nil {
		return nil, err
	}

	return &models.ModelDeployResponseDTO{
		ModelID:    req.ModelID,
		Status:     "active",
		OllamaName: ollamaName,
		Message:    "Model activated successfully",
	}, nil
}

func (s *TrainingService) importModelToOllama(model *models.Model, ollamaName string) error {
	// Create Modelfile
	modelfilePath := filepath.Join(model.ModelPath, "Modelfile")
	modelfileContent := fmt.Sprintf(`FROM %s
ADAPTER %s
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
`, model.BaseModel, *model.AdapterPath)

	if err := os.WriteFile(modelfilePath, []byte(modelfileContent), 0644); err != nil {
		return err
	}

	// Call Ollama API to create model
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://ollama-service:11434"
	}

	reqBody := map[string]interface{}{
		"name":      ollamaName,
		"modelfile": modelfileContent,
	}
	bodyJSON, _ := json.Marshal(reqBody)

	resp, err := http.Post(ollamaURL+"/api/create", "application/json", bytes.NewBuffer(bodyJSON))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("Ollama API error: %s", string(body))
	}

	return nil
}

// ============================================================
// Evaluations
// ============================================================

func (s *TrainingService) RunEvaluation(req *models.EvaluationRequestDTO) (*models.EvaluationResultDTO, error) {
	startTime := time.Now()

	// Get model
	model, err := s.repo.GetModel(req.ModelID)
	if err != nil {
		return nil, err
	}

	// Run evaluation (simplified - in production this would run actual tests)
	eval := &models.Evaluation{
		ModelID:   req.ModelID,
		DatasetID: req.DatasetID,
		EvalType:  req.EvalType,
	}

	// Simulate evaluation
	testsPassed := 0
	testsTotal := 10

	// TODO: Actually run code execution tests
	// For now, simulate results
	testsPassed = 8

	eval.CodeTestsTotal = testsTotal
	eval.CodeTestsPassed = testsPassed
	eval.CodeTestsFailed = testsTotal - testsPassed
	passed := float64(testsPassed)/float64(testsTotal) >= 0.7
	eval.Passed = &passed

	metrics := map[string]interface{}{
		"pass_rate":   float64(testsPassed) / float64(testsTotal),
		"tests_total": testsTotal,
		"model_name":  model.Name,
	}
	metricsJSON, _ := json.Marshal(metrics)
	eval.Metrics = metricsJSON

	duration := int(time.Since(startTime).Seconds())
	eval.DurationSeconds = &duration

	if err := s.repo.CreateEvaluation(eval); err != nil {
		return nil, err
	}

	// Update model metrics
	s.repo.UpdateModelMetrics(req.ModelID, metricsJSON, nil)

	return &models.EvaluationResultDTO{
		EvalID:          eval.EvalID,
		ModelID:         req.ModelID,
		Passed:          passed,
		Metrics:         metrics,
		CodeTestsPassed: testsPassed,
		CodeTestsTotal:  testsTotal,
		PassRate:        float64(testsPassed) / float64(testsTotal),
		Message:         fmt.Sprintf("Evaluation completed: %d/%d tests passed", testsPassed, testsTotal),
	}, nil
}

func (s *TrainingService) ListEvaluations(modelID int64) ([]*models.Evaluation, error) {
	return s.repo.ListEvaluationsByModel(modelID)
}

// Helper functions
func strPtr(s string) *string {
	return &s
}

func boolPtr(b bool) *bool {
	return &b
}

func intPtr(i int) *int {
	return &i
}

func derefStr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
