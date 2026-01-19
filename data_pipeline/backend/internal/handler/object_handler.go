package handler

import (
	"data-pipeline-backend/internal/models"
	"data-pipeline-backend/internal/repository"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (h *Handler) GetAllObjects(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	objects, err := h.objectService.FindAll()
	if err != nil {
		h.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.JSON(w, http.StatusOK, objects)
}

func (h *Handler) GetObject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid object ID")
		return
	}

	object, err := h.objectService.FindByID(id)
	if err != nil {
		if err == repository.ErrObjectNotFound {
			h.Error(w, http.StatusNotFound, "Object not found")
			return
		}
		h.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.JSON(w, http.StatusOK, object)
}

func (h *Handler) GetObjectsByFlow(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	flowID, err := strconv.ParseInt(vars["flowId"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid flow ID")
		return
	}

	objects, err := h.objectService.FindByFlow(flowID)
	if err != nil {
		if err.Error() == "플로우를 찾을 수 없습니다" {
			h.Error(w, http.StatusNotFound, "Flow not found")
			return
		}
		h.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.JSON(w, http.StatusOK, objects)
}

func (h *Handler) CreateObject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req models.ObjectRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.FlowID == nil {
		h.Error(w, http.StatusBadRequest, "Flow ID is required")
		return
	}

	object, err := h.objectService.Create(&req)
	if err != nil {
		h.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	h.JSON(w, http.StatusCreated, object)
}

func (h *Handler) UpdateObject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid object ID")
		return
	}

	var req models.ObjectRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	req.ID = &id

	object, err := h.objectService.Update(&req)
	if err != nil {
		if err == repository.ErrObjectNotFound {
			h.Error(w, http.StatusNotFound, "Object not found")
			return
		}
		h.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	h.JSON(w, http.StatusOK, object)
}

func (h *Handler) DeleteObject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid object ID")
		return
	}

	if err := h.objectService.Delete(id); err != nil {
		if err == repository.ErrObjectNotFound {
			h.Error(w, http.StatusNotFound, "Object not found")
			return
		}
		h.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.Message(w, http.StatusOK, "Object deleted successfully")
}
