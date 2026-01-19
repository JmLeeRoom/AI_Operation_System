package handler

import (
	"data-pipeline-backend/internal/models"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// ============================================================
// Training Runs
// ============================================================

func (h *Handler) StartTraining(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.TrainingRunRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Name == "" {
		h.Error(w, http.StatusBadRequest, "Training run name is required")
		return
	}

	if req.BaseModel == "" {
		req.BaseModel = "codellama/CodeLlama-7b-hf"
	}

	if req.ModelType == "" {
		req.ModelType = "qlora"
	}

	result, err := h.trainingService.StartTraining(&req)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusCreated, result)
}

func (h *Handler) GetTrainingStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid training run ID")
		return
	}

	status, err := h.trainingService.GetTrainingStatus(id)
	if err != nil {
		h.Error(w, http.StatusNotFound, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, status)
}

func (h *Handler) CancelTraining(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid training run ID")
		return
	}

	if err := h.trainingService.CancelTraining(id); err != nil {
		h.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	h.Message(w, http.StatusOK, "Training cancelled")
}

func (h *Handler) ListTrainingRuns(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	limit := 50
	offset := 0

	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}
	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = parsed
		}
	}

	runs, err := h.trainingService.ListTrainingRuns(limit, offset)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, runs)
}

func (h *Handler) GetTrainingRun(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid training run ID")
		return
	}

	run, err := h.trainingService.GetTrainingRun(id)
	if err != nil {
		h.Error(w, http.StatusNotFound, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, run)
}

// ============================================================
// Feedbacks
// ============================================================

func (h *Handler) CreateFeedback(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.FeedbackRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.InputPrompt == "" {
		h.Error(w, http.StatusBadRequest, "Input prompt is required")
		return
	}

	if req.FeedbackType == "" {
		req.FeedbackType = "code_generation"
	}

	fb, err := h.trainingService.CreateFeedback(&req)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusCreated, fb)
}

func (h *Handler) ListFeedbacks(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	limit := 50
	offset := 0

	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}
	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = parsed
		}
	}

	// Parse filters from query params
	var filters *models.FeedbackFilters
	if r.URL.Query().Get("min_rating") != "" || r.URL.Query().Get("is_accepted") != "" {
		filters = &models.FeedbackFilters{}
		if minRating := r.URL.Query().Get("min_rating"); minRating != "" {
			if parsed, err := strconv.Atoi(minRating); err == nil {
				filters.MinRating = &parsed
			}
		}
		if isAccepted := r.URL.Query().Get("is_accepted"); isAccepted != "" {
			accepted := isAccepted == "true"
			filters.IsAccepted = &accepted
		}
	}

	feedbacks, err := h.trainingService.ListFeedbacks(limit, offset, filters)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, feedbacks)
}

func (h *Handler) GetFeedbackStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	stats, err := h.trainingService.GetFeedbackStats()
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, stats)
}

// ============================================================
// Datasets
// ============================================================

func (h *Handler) BuildDataset(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.DatasetBuildRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Name == "" || req.Version == "" {
		h.Error(w, http.StatusBadRequest, "Dataset name and version are required")
		return
	}

	// Set defaults
	if req.TrainSplitRatio == 0 {
		req.TrainSplitRatio = 0.8
	}
	if req.EvalSplitRatio == 0 {
		req.EvalSplitRatio = 0.1
	}
	if req.TestSplitRatio == 0 {
		req.TestSplitRatio = 0.1
	}

	ds, err := h.trainingService.BuildDataset(&req)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusCreated, ds)
}

func (h *Handler) ListDatasets(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	limit := 50
	offset := 0

	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}
	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = parsed
		}
	}

	datasets, err := h.trainingService.ListDatasets(limit, offset)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, datasets)
}

func (h *Handler) GetDataset(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid dataset ID")
		return
	}

	ds, err := h.trainingService.GetDataset(id)
	if err != nil {
		h.Error(w, http.StatusNotFound, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, ds)
}

func (h *Handler) SetActiveDataset(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid dataset ID")
		return
	}

	if err := h.trainingService.SetActiveDataset(id); err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.Message(w, http.StatusOK, "Dataset activated")
}

// ============================================================
// Models
// ============================================================

func (h *Handler) ListModels(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	limit := 50
	offset := 0

	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}
	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = parsed
		}
	}

	modelsResult, err := h.trainingService.ListModels(limit, offset)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, modelsResult)
}

func (h *Handler) GetModel(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid model ID")
		return
	}

	model, err := h.trainingService.GetModel(id)
	if err != nil {
		h.Error(w, http.StatusNotFound, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, model)
}

func (h *Handler) GetActiveModel(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	model, err := h.trainingService.GetActiveModel()
	if err != nil {
		h.Error(w, http.StatusNotFound, "No active model found")
		return
	}

	h.JSON(w, http.StatusOK, model)
}

func (h *Handler) ActivateModel(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.ModelActivateRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.ModelID == 0 {
		h.Error(w, http.StatusBadRequest, "Model ID is required")
		return
	}

	result, err := h.trainingService.ActivateModel(&req)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, result)
}

// ============================================================
// Evaluations
// ============================================================

func (h *Handler) RunEvaluation(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.EvaluationRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.ModelID == 0 {
		h.Error(w, http.StatusBadRequest, "Model ID is required")
		return
	}

	if req.EvalType == "" {
		req.EvalType = "automated"
	}

	result, err := h.trainingService.RunEvaluation(&req)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, result)
}

func (h *Handler) ListEvaluations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	modelID, err := strconv.ParseInt(vars["modelId"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid model ID")
		return
	}

	evals, err := h.trainingService.ListEvaluations(modelID)
	if err != nil {
		h.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, evals)
}
