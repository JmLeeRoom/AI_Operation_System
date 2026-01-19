package repository

import (
	"data-pipeline-backend/internal/models"
	"database/sql"
	"errors"
	"time"
)

var (
	ErrFlowNotFound = errors.New("flow not found")
)

type FlowRepository struct {
	db *sql.DB
}

func NewFlowRepository(db *sql.DB) *FlowRepository {
	return &FlowRepository{db: db}
}

func (r *FlowRepository) Create(flow *models.Flow) error {
	query := `
		INSERT INTO flows (name, lastest_run, run_type, created_by)
		VALUES ($1, $2, $3, $4)
		RETURNING f_id, saved_at
	`

	var createdBy interface{}
	if flow.CreatedBy != nil {
		createdBy = *flow.CreatedBy
	} else {
		createdBy = nil
	}

	var latestRun interface{}
	if flow.LatestRun != nil {
		latestRun = flow.LatestRun
	} else {
		latestRun = nil
	}

	err := r.db.QueryRow(
		query,
		flow.Name,
		latestRun,
		flow.RunType,
		createdBy,
	).Scan(&flow.ID, &flow.SavedAt)

	return err
}

func (r *FlowRepository) FindByID(id int64) (*models.Flow, error) {
	query := `
		SELECT f_id, name, lastest_run, run_type, created_by, saved_at
		FROM flows
		WHERE f_id = $1
	`

	flow := &models.Flow{}
	var latestRun sql.NullTime
	var createdBy sql.NullInt64

	err := r.db.QueryRow(query, id).Scan(
		&flow.ID,
		&flow.Name,
		&latestRun,
		&flow.RunType,
		&createdBy,
		&flow.SavedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrFlowNotFound
		}
		return nil, err
	}

	if latestRun.Valid {
		flow.LatestRun = &latestRun.Time
	}

	if createdBy.Valid {
		id := createdBy.Int64
		flow.CreatedBy = &id
	}

	return flow, nil
}

func (r *FlowRepository) FindAll() ([]*models.Flow, error) {
	query := `
		SELECT f_id, name, lastest_run, run_type, created_by, saved_at
		FROM flows
		ORDER BY f_id
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var flows []*models.Flow
	for rows.Next() {
		flow := &models.Flow{}
		var latestRun sql.NullTime
		var createdBy sql.NullInt64

		err := rows.Scan(
			&flow.ID,
			&flow.Name,
			&latestRun,
			&flow.RunType,
			&createdBy,
			&flow.SavedAt,
		)
		if err != nil {
			return nil, err
		}

		if latestRun.Valid {
			flow.LatestRun = &latestRun.Time
		}

		if createdBy.Valid {
			id := createdBy.Int64
			flow.CreatedBy = &id
		}

		flows = append(flows, flow)
	}

	return flows, rows.Err()
}

func (r *FlowRepository) Update(flow *models.Flow) error {
	_, err := r.FindByID(flow.ID)
	if err != nil {
		return err
	}

	query := `
		UPDATE flows
		SET name = $1, lastest_run = $2, run_type = $3, created_by = $4
		WHERE f_id = $5
	`

	var latestRun interface{}
	if flow.LatestRun != nil {
		latestRun = flow.LatestRun
	} else {
		latestRun = nil
	}

	var createdBy interface{}
	if flow.CreatedBy != nil {
		createdBy = *flow.CreatedBy
	} else {
		createdBy = nil
	}

	_, err = r.db.Exec(
		query,
		flow.Name,
		latestRun,
		flow.RunType,
		createdBy,
		flow.ID,
	)

	return err
}

func (r *FlowRepository) Delete(id int64) error {
	_, err := r.FindByID(id)
	if err != nil {
		return err
	}

	query := `DELETE FROM flows WHERE f_id = $1`
	_, err = r.db.Exec(query, id)
	return err
}

func (r *FlowRepository) UpdateLatestRun(id int64, latestRun time.Time) error {
	query := `UPDATE flows SET lastest_run = $1 WHERE f_id = $2`
	_, err := r.db.Exec(query, latestRun, id)
	return err
}
