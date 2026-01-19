package models

import "time"

// Flow represents a flow entity
type Flow struct {
	ID        int64     `json:"f_id" db:"f_id"`
	Name      string    `json:"name" db:"name"`
	LatestRun *time.Time `json:"lastest_run,omitempty" db:"lastest_run"`
	RunType   string    `json:"run_type" db:"run_type"`
	CreatedBy *int64    `json:"-" db:"created_by"`
	SavedAt   time.Time `json:"saved_at" db:"saved_at"`
}

// FlowRequestDTO represents the request payload for flow operations
type FlowRequestDTO struct {
	ID     *int64 `json:"f_id,omitempty"`
	Name   string `json:"name"`
	RunType string `json:"run_type"`
	UserID *int64 `json:"u_id,omitempty"`
}

// FlowResponseDTO represents the response payload for flow operations
type FlowResponseDTO struct {
	ID        int64      `json:"f_id"`
	Name      string     `json:"name"`
	LatestRun *time.Time `json:"lastest_run,omitempty"`
	RunType   string     `json:"run_type"`
	SavedAt   time.Time  `json:"saved_at"`
}

// ToResponseDTO converts Flow entity to FlowResponseDTO
func (f *Flow) ToResponseDTO() *FlowResponseDTO {
	return &FlowResponseDTO{
		ID:        f.ID,
		Name:      f.Name,
		LatestRun: f.LatestRun,
		RunType:   f.RunType,
		SavedAt:   f.SavedAt,
	}
}
