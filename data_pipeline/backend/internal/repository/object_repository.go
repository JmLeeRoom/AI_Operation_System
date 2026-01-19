package repository

import (
	"data-pipeline-backend/internal/models"
	"database/sql"
	"encoding/json"
	"errors"
)

var (
	ErrObjectNotFound = errors.New("object not found")
)

type ObjectRepository struct {
	db *sql.DB
}

func NewObjectRepository(db *sql.DB) *ObjectRepository {
	return &ObjectRepository{db: db}
}

func (r *ObjectRepository) Create(object *models.Object) error {
	query := `
		INSERT INTO objects (type, x, y, label, params, target, flow)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING o_id
	`

	var xValue, yValue, targetValue, flowID interface{}
	if object.X != nil {
		xValue = *object.X
	}
	if object.Y != nil {
		yValue = *object.Y
	}
	if object.Target != nil {
		targetValue = *object.Target
	}
	if object.FlowID != nil {
		flowID = *object.FlowID
	}

	var paramsText interface{}
	if len(object.Params) > 0 {
		paramsText = string(object.Params)
	}

	err := r.db.QueryRow(
		query,
		object.Type,
		xValue,
		yValue,
		object.Label,
		paramsText,
		targetValue,
		flowID,
	).Scan(&object.ID)

	return err
}

func (r *ObjectRepository) FindByID(id int64) (*models.Object, error) {
	query := `
		SELECT o_id, type, x, y, label, params, target, flow
		FROM objects
		WHERE o_id = $1
	`

	object := &models.Object{}
	var xValue, yValue, targetValue, flowID sql.NullInt64
	var paramsText sql.NullString

	err := r.db.QueryRow(query, id).Scan(
		&object.ID,
		&object.Type,
		&xValue,
		&yValue,
		&object.Label,
		&paramsText,
		&targetValue,
		&flowID,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrObjectNotFound
		}
		return nil, err
	}

	if xValue.Valid {
		x := xValue.Int64
		object.X = &x
	}
	if yValue.Valid {
		y := yValue.Int64
		object.Y = &y
	}
	if paramsText.Valid && paramsText.String != "" {
		object.Params = json.RawMessage(paramsText.String)
	}
	if targetValue.Valid {
		target := targetValue.Int64
		object.Target = &target
	}
	if flowID.Valid {
		flow := flowID.Int64
		object.FlowID = &flow
	}

	return object, nil
}

func (r *ObjectRepository) FindAll() ([]*models.Object, error) {
	query := `
		SELECT o_id, type, x, y, label, params, target, flow
		FROM objects
		ORDER BY o_id
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var objects []*models.Object
	for rows.Next() {
		object := &models.Object{}
		var xValue, yValue, targetValue, flowID sql.NullInt64
		var paramsText sql.NullString

		err := rows.Scan(
			&object.ID,
			&object.Type,
			&xValue,
			&yValue,
			&object.Label,
			&paramsText,
			&targetValue,
			&flowID,
		)
		if err != nil {
			return nil, err
		}

		if xValue.Valid {
			x := xValue.Int64
			object.X = &x
		}
		if yValue.Valid {
			y := yValue.Int64
			object.Y = &y
		}
		if paramsText.Valid && paramsText.String != "" {
			object.Params = json.RawMessage(paramsText.String)
		}
		if targetValue.Valid {
			target := targetValue.Int64
			object.Target = &target
		}
		if flowID.Valid {
			flow := flowID.Int64
			object.FlowID = &flow
		}

		objects = append(objects, object)
	}

	return objects, rows.Err()
}

func (r *ObjectRepository) FindByFlow(flowID int64) ([]*models.Object, error) {
	query := `
		SELECT o_id, type, x, y, label, params, target, flow
		FROM objects
		WHERE flow = $1
		ORDER BY o_id
	`

	rows, err := r.db.Query(query, flowID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var objects []*models.Object
	for rows.Next() {
		object := &models.Object{}
		var xValue, yValue, targetValue, flowID sql.NullInt64
		var paramsText sql.NullString

		err := rows.Scan(
			&object.ID,
			&object.Type,
			&xValue,
			&yValue,
			&object.Label,
			&paramsText,
			&targetValue,
			&flowID,
		)
		if err != nil {
			return nil, err
		}

		if xValue.Valid {
			x := xValue.Int64
			object.X = &x
		}
		if yValue.Valid {
			y := yValue.Int64
			object.Y = &y
		}
		if paramsText.Valid && paramsText.String != "" {
			object.Params = json.RawMessage(paramsText.String)
		}
		if targetValue.Valid {
			target := targetValue.Int64
			object.Target = &target
		}
		if flowID.Valid {
			flow := flowID.Int64
			object.FlowID = &flow
		}

		objects = append(objects, object)
	}

	return objects, rows.Err()
}

func (r *ObjectRepository) Update(object *models.Object) error {
	_, err := r.FindByID(object.ID)
	if err != nil {
		return err
	}

	query := `
		UPDATE objects
		SET type = $1, x = $2, y = $3, label = $4, params = $5, target = $6, flow = $7
		WHERE o_id = $8
	`

	var xValue, yValue, targetValue, flowID interface{}
	if object.X != nil {
		xValue = *object.X
	}
	if object.Y != nil {
		yValue = *object.Y
	}
	if object.Target != nil {
		targetValue = *object.Target
	}
	if object.FlowID != nil {
		flowID = *object.FlowID
	}

	var paramsText interface{}
	if len(object.Params) > 0 {
		paramsText = string(object.Params)
	}

	_, err = r.db.Exec(
		query,
		object.Type,
		xValue,
		yValue,
		object.Label,
		paramsText,
		targetValue,
		flowID,
		object.ID,
	)

	return err
}

func (r *ObjectRepository) Delete(id int64) error {
	_, err := r.FindByID(id)
	if err != nil {
		return err
	}

	query := `DELETE FROM objects WHERE o_id = $1`
	_, err = r.db.Exec(query, id)
	return err
}
