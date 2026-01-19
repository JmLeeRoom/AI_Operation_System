package router

import (
	"data-pipeline-backend/internal/handler"
	"data-pipeline-backend/internal/middleware"
	"database/sql"

	"github.com/gorilla/mux"
)

func SetupRouter(db *sql.DB) *mux.Router {
	r := mux.NewRouter()
	h := handler.NewHandler(db)

	r.Use(middleware.CORSMiddleware())

	// Health check endpoints (before /api prefix)
	r.HandleFunc("/healthz", h.Healthz).Methods("GET")
	r.HandleFunc("/readyz", h.Readyz).Methods("GET")

	api := r.PathPrefix("/api").Subrouter()

	// Flows
	api.HandleFunc("/flows", h.GetAllFlows).Methods("GET")
	api.HandleFunc("/flows", h.CreateFlow).Methods("POST")
	api.HandleFunc("/flows/{id}", h.GetFlow).Methods("GET")
	api.HandleFunc("/flows/{id}", h.UpdateFlow).Methods("PUT")
	api.HandleFunc("/flows/{id}", h.DeleteFlow).Methods("DELETE")

	// Objects
	api.HandleFunc("/objects", h.GetAllObjects).Methods("GET")
	api.HandleFunc("/objects", h.CreateObject).Methods("POST")
	api.HandleFunc("/objects/{id}", h.GetObject).Methods("GET")
	api.HandleFunc("/objects/{id}", h.UpdateObject).Methods("PUT")
	api.HandleFunc("/objects/{id}", h.DeleteObject).Methods("DELETE")
	api.HandleFunc("/objects/flow/{flowId}", h.GetObjectsByFlow).Methods("GET")

	// K8s
	api.HandleFunc("/k8s/deploy/stream", h.DeployStream).Methods("POST")
	api.HandleFunc("/k8s/delete", h.DeleteK8sResources).Methods("DELETE")
	api.HandleFunc("/k8s/test", h.UnitTest).Methods("POST")

	// Jupyter (Python execution)
	api.HandleFunc("/python/execute", h.ExecutePythonCode).Methods("POST")
	api.HandleFunc("/python/debug", h.DebugPythonCode).Methods("POST")
	
	// Debug session management
	api.HandleFunc("/python/debug/session", h.DebugSessionControl).Methods("POST")
	api.HandleFunc("/python/debug/session", h.DeleteDebugSession).Methods("DELETE")

	// AI Agent (Code generation/modification)
	api.HandleFunc("/ai/generate", h.GenerateCode).Methods("POST")

	// Data operations
	api.HandleFunc("/data/load", h.LoadData).Methods("POST")
	api.HandleFunc("/data/save", h.SaveData).Methods("POST")
	api.HandleFunc("/data/preview", h.PreviewFile).Methods("POST")
	api.HandleFunc("/data/files", h.ListFiles).Methods("POST")

	// Workflow execution
	api.HandleFunc("/workflow/execute", h.ExecuteWorkflow).Methods("POST")

	// ============================================================
	// ML Pipeline APIs
	// ============================================================

	// Training
	api.HandleFunc("/train/start", h.StartTraining).Methods("POST")
	api.HandleFunc("/train/runs", h.ListTrainingRuns).Methods("GET")
	api.HandleFunc("/train/runs/{id}", h.GetTrainingRun).Methods("GET")
	api.HandleFunc("/train/runs/{id}/status", h.GetTrainingStatus).Methods("GET")
	api.HandleFunc("/train/runs/{id}/cancel", h.CancelTraining).Methods("POST")

	// Feedbacks
	api.HandleFunc("/feedbacks", h.ListFeedbacks).Methods("GET")
	api.HandleFunc("/feedbacks", h.CreateFeedback).Methods("POST")
	api.HandleFunc("/feedbacks/stats", h.GetFeedbackStats).Methods("GET")

	// Datasets
	api.HandleFunc("/datasets", h.ListDatasets).Methods("GET")
	api.HandleFunc("/datasets/build", h.BuildDataset).Methods("POST")
	api.HandleFunc("/datasets/{id}", h.GetDataset).Methods("GET")
	api.HandleFunc("/datasets/{id}/activate", h.SetActiveDataset).Methods("POST")

	// Models
	api.HandleFunc("/models", h.ListModels).Methods("GET")
	api.HandleFunc("/models/active", h.GetActiveModel).Methods("GET")
	api.HandleFunc("/models/activate", h.ActivateModel).Methods("POST")
	api.HandleFunc("/models/{id}", h.GetModel).Methods("GET")

	// Evaluations
	api.HandleFunc("/evaluations/run", h.RunEvaluation).Methods("POST")
	api.HandleFunc("/evaluations/model/{modelId}", h.ListEvaluations).Methods("GET")

	return r
}
