package handler

import (
	"data-pipeline-backend/internal/models"
	"data-pipeline-backend/internal/repository"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (h *Handler) GetAllFlows(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	flows, err := h.flowService.FindAll()
	if err != nil {
		h.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.JSON(w, http.StatusOK, flows)
}

func (h *Handler) GetFlow(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid flow ID")
		return
	}

	flow, err := h.flowService.FindByID(id)
	if err != nil {
		if err == repository.ErrFlowNotFound {
			h.Error(w, http.StatusNotFound, "Flow not found")
			return
		}
		h.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.JSON(w, http.StatusOK, flow)
}

func (h *Handler) CreateFlow(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.FlowRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Name == "" {
		h.Error(w, http.StatusBadRequest, "Flow name is required")
		return
	}

	flow, err := h.flowService.Create(&req)
	if err != nil {
		h.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	h.JSON(w, http.StatusCreated, flow)
}

func (h *Handler) UpdateFlow(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid flow ID")
		return
	}

	var req models.FlowRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	req.ID = &id

	if req.Name == "" {
		h.Error(w, http.StatusBadRequest, "Flow name is required")
		return
	}

	flow, err := h.flowService.Update(&req)
	if err != nil {
		if err == repository.ErrFlowNotFound {
			h.Error(w, http.StatusNotFound, "Flow not found")
			return
		}
		h.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, flow)
}

func (h *Handler) DeleteFlow(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid flow ID")
		return
	}

	if err := h.flowService.Delete(id); err != nil {
		if err == repository.ErrFlowNotFound {
			h.Error(w, http.StatusNotFound, "Flow not found")
			return
		}
		h.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.Message(w, http.StatusOK, "Flow deleted successfully")
}
