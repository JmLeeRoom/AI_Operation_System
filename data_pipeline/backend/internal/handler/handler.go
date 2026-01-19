package handler

import (
	"data-pipeline-backend/internal/repository"
	"data-pipeline-backend/internal/service"
	"database/sql"
	"encoding/json"
	"net/http"
)

type Handler struct {
	flowRepo        *repository.FlowRepository
	flowService     *service.FlowService
	objectRepo      *repository.ObjectRepository
	objectService   *service.ObjectService
	trainingRepo    *repository.TrainingRepository
	trainingService *service.TrainingService
}

func NewHandler(db *sql.DB) *Handler {
	flowRepo := repository.NewFlowRepository(db)
	objectRepo := repository.NewObjectRepository(db)
	trainingRepo := repository.NewTrainingRepository(db)
	
	flowService := service.NewFlowService(flowRepo)
	objectService := service.NewObjectService(objectRepo, flowRepo)
	trainingService := service.NewTrainingService(trainingRepo)

	return &Handler{
		flowRepo:        flowRepo,
		flowService:     flowService,
		objectRepo:      objectRepo,
		objectService:   objectService,
		trainingRepo:    trainingRepo,
		trainingService: trainingService,
	}
}

func (h *Handler) JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func (h *Handler) Error(w http.ResponseWriter, status int, message string) {
	h.JSON(w, status, map[string]string{"error": message})
}

func (h *Handler) Message(w http.ResponseWriter, status int, message string) {
	h.JSON(w, status, map[string]string{"message": message})
}
