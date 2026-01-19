package handler

import (
	"net/http"
)

// Healthz handles health check requests
func (h *Handler) Healthz(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

// Readyz handles readiness check requests
func (h *Handler) Readyz(w http.ResponseWriter, r *http.Request) {
	// Simple readiness check - if handler is initialized, we're ready
	// Database connection is checked during startup
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
