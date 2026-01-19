package repository

import (
	"data-pipeline-backend/internal/models"
	"database/sql"
	"encoding/json"
	"errors"
	"time"
)

var (
	ErrTrainingRunNotFound = errors.New("training run not found")
	ErrFeedbackNotFound    = errors.New("feedback not found")
	ErrDatasetNotFound     = errors.New("dataset not found")
	ErrModelNotFound       = errors.New("model not found")
	ErrEvaluationNotFound  = errors.New("evaluation not found")
)

type TrainingRepository struct {
	db *sql.DB
}

func NewTrainingRepository(db *sql.DB) *TrainingRepository {
	return &TrainingRepository{db: db}
}

// ============================================================
// Training Runs
// ============================================================

func (r *TrainingRepository) CreateTrainingRun(run *models.TrainingRun) error {
	query := `
		INSERT INTO training_runs (name, description, status, base_model, model_type, hyperparameters, dataset_id, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING run_id, created_at
	`
	return r.db.QueryRow(query,
		run.Name,
		run.Description,
		run.Status,
		run.BaseModel,
		run.ModelType,
		run.Hyperparameters,
		run.DatasetID,
		run.CreatedBy,
	).Scan(&run.RunID, &run.CreatedAt)
}

func (r *TrainingRepository) GetTrainingRun(id int64) (*models.TrainingRun, error) {
	query := `
		SELECT run_id, name, description, status, base_model, model_type, hyperparameters,
		       dataset_id, dataset_version, started_at, completed_at, duration_seconds,
		       output_model_path, metrics, error_message, gpu_info, created_at, created_by
		FROM training_runs WHERE run_id = $1
	`
	run := &models.TrainingRun{}
	var hyperparameters, metrics, gpuInfo sql.NullString
	
	err := r.db.QueryRow(query, id).Scan(
		&run.RunID, &run.Name, &run.Description, &run.Status, &run.BaseModel, &run.ModelType,
		&hyperparameters, &run.DatasetID, &run.DatasetVersion, &run.StartedAt, &run.CompletedAt,
		&run.DurationSeconds, &run.OutputModelPath, &metrics, &run.ErrorMessage, &gpuInfo,
		&run.CreatedAt, &run.CreatedBy,
	)
	if err == sql.ErrNoRows {
		return nil, ErrTrainingRunNotFound
	}
	if err != nil {
		return nil, err
	}
	
	if hyperparameters.Valid {
		run.Hyperparameters = json.RawMessage(hyperparameters.String)
	}
	if metrics.Valid {
		run.Metrics = json.RawMessage(metrics.String)
	}
	if gpuInfo.Valid {
		run.GPUInfo = json.RawMessage(gpuInfo.String)
	}
	
	return run, nil
}

func (r *TrainingRepository) ListTrainingRuns(limit, offset int) ([]*models.TrainingRun, error) {
	query := `
		SELECT run_id, name, description, status, base_model, model_type, hyperparameters,
		       dataset_id, started_at, completed_at, duration_seconds, metrics, created_at
		FROM training_runs
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var runs []*models.TrainingRun
	for rows.Next() {
		run := &models.TrainingRun{}
		var hyperparameters, metrics sql.NullString
		
		err := rows.Scan(
			&run.RunID, &run.Name, &run.Description, &run.Status, &run.BaseModel, &run.ModelType,
			&hyperparameters, &run.DatasetID, &run.StartedAt, &run.CompletedAt,
			&run.DurationSeconds, &metrics, &run.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		
		if hyperparameters.Valid {
			run.Hyperparameters = json.RawMessage(hyperparameters.String)
		}
		if metrics.Valid {
			run.Metrics = json.RawMessage(metrics.String)
		}
		
		runs = append(runs, run)
	}
	
	return runs, rows.Err()
}

func (r *TrainingRepository) UpdateTrainingRunStatus(id int64, status string, errorMsg *string) error {
	query := `UPDATE training_runs SET status = $2, error_message = $3 WHERE run_id = $1`
	_, err := r.db.Exec(query, id, status, errorMsg)
	return err
}

func (r *TrainingRepository) UpdateTrainingRunStart(id int64) error {
	query := `UPDATE training_runs SET status = 'running', started_at = $2 WHERE run_id = $1`
	_, err := r.db.Exec(query, id, time.Now())
	return err
}

func (r *TrainingRepository) UpdateTrainingRunComplete(id int64, outputPath string, metrics json.RawMessage) error {
	completedAt := time.Now()
	
	// Get started_at to calculate duration
	var startedAt sql.NullTime
	err := r.db.QueryRow(`SELECT started_at FROM training_runs WHERE run_id = $1`, id).Scan(&startedAt)
	if err != nil {
		return err
	}
	
	var duration int
	if startedAt.Valid {
		duration = int(completedAt.Sub(startedAt.Time).Seconds())
	}
	
	query := `
		UPDATE training_runs 
		SET status = 'completed', completed_at = $2, duration_seconds = $3, output_model_path = $4, metrics = $5
		WHERE run_id = $1
	`
	_, err = r.db.Exec(query, id, completedAt, duration, outputPath, metrics)
	return err
}

// ============================================================
// Feedbacks
// ============================================================

func (r *TrainingRepository) CreateFeedback(fb *models.Feedback) error {
	query := `
		INSERT INTO feedbacks (feedback_type, input_prompt, input_code, output_code, output_explanation,
		                       execution_success, execution_output, execution_error, rating, is_accepted,
		                       user_correction, session_id, node_id, flow_id, model_version)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING feedback_id, created_at
	`
	return r.db.QueryRow(query,
		fb.FeedbackType, fb.InputPrompt, fb.InputCode, fb.OutputCode, fb.OutputExplanation,
		fb.ExecutionSuccess, fb.ExecutionOutput, fb.ExecutionError, fb.Rating, fb.IsAccepted,
		fb.UserCorrection, fb.SessionID, fb.NodeID, fb.FlowID, fb.ModelVersion,
	).Scan(&fb.FeedbackID, &fb.CreatedAt)
}

func (r *TrainingRepository) ListFeedbacks(limit, offset int, filters *models.FeedbackFilters) ([]*models.Feedback, error) {
	query := `
		SELECT feedback_id, feedback_type, input_prompt, input_code, output_code, output_explanation,
		       execution_success, rating, is_accepted, user_correction, model_version, 
		       used_for_training, created_at
		FROM feedbacks
		WHERE ($3::int IS NULL OR rating >= $3)
		  AND ($4::boolean IS NULL OR is_accepted = $4)
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	
	var minRating sql.NullInt32
	var isAccepted sql.NullBool
	
	if filters != nil {
		if filters.MinRating != nil {
			minRating = sql.NullInt32{Int32: int32(*filters.MinRating), Valid: true}
		}
		if filters.IsAccepted != nil {
			isAccepted = sql.NullBool{Bool: *filters.IsAccepted, Valid: true}
		}
	}
	
	rows, err := r.db.Query(query, limit, offset, minRating, isAccepted)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var feedbacks []*models.Feedback
	for rows.Next() {
		fb := &models.Feedback{}
		err := rows.Scan(
			&fb.FeedbackID, &fb.FeedbackType, &fb.InputPrompt, &fb.InputCode, &fb.OutputCode,
			&fb.OutputExplanation, &fb.ExecutionSuccess, &fb.Rating, &fb.IsAccepted,
			&fb.UserCorrection, &fb.ModelVersion, &fb.UsedForTraining, &fb.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		feedbacks = append(feedbacks, fb)
	}
	
	return feedbacks, rows.Err()
}

func (r *TrainingRepository) CountFeedbacks(filters *models.FeedbackFilters) (int, error) {
	query := `
		SELECT COUNT(*) FROM feedbacks
		WHERE ($1::int IS NULL OR rating >= $1)
		  AND ($2::boolean IS NULL OR is_accepted = $2)
		  AND used_for_training = false
	`
	
	var minRating sql.NullInt32
	var isAccepted sql.NullBool
	
	if filters != nil {
		if filters.MinRating != nil {
			minRating = sql.NullInt32{Int32: int32(*filters.MinRating), Valid: true}
		}
		if filters.IsAccepted != nil {
			isAccepted = sql.NullBool{Bool: *filters.IsAccepted, Valid: true}
		}
	}
	
	var count int
	err := r.db.QueryRow(query, minRating, isAccepted).Scan(&count)
	return count, err
}

func (r *TrainingRepository) MarkFeedbacksAsUsed(datasetID int64, feedbackIDs []int64) error {
	if len(feedbackIDs) == 0 {
		return nil
	}
	
	query := `UPDATE feedbacks SET used_for_training = true, dataset_id = $1 WHERE feedback_id = ANY($2)`
	_, err := r.db.Exec(query, datasetID, feedbackIDs)
	return err
}

// ============================================================
// Datasets
// ============================================================

func (r *TrainingRepository) CreateDataset(ds *models.Dataset) error {
	query := `
		INSERT INTO datasets (name, version, description, total_samples, train_samples, eval_samples, test_samples,
		                      data_path, train_file, eval_file, test_file, config, status, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING dataset_id, created_at
	`
	return r.db.QueryRow(query,
		ds.Name, ds.Version, ds.Description, ds.TotalSamples, ds.TrainSamples, ds.EvalSamples,
		ds.TestSamples, ds.DataPath, ds.TrainFile, ds.EvalFile, ds.TestFile, ds.Config,
		ds.Status, ds.CreatedBy,
	).Scan(&ds.DatasetID, &ds.CreatedAt)
}

func (r *TrainingRepository) GetDataset(id int64) (*models.Dataset, error) {
	query := `
		SELECT dataset_id, name, version, description, total_samples, train_samples, eval_samples,
		       test_samples, data_path, train_file, eval_file, test_file, config, status, is_active, created_at
		FROM datasets WHERE dataset_id = $1
	`
	ds := &models.Dataset{}
	var config sql.NullString
	
	err := r.db.QueryRow(query, id).Scan(
		&ds.DatasetID, &ds.Name, &ds.Version, &ds.Description, &ds.TotalSamples,
		&ds.TrainSamples, &ds.EvalSamples, &ds.TestSamples, &ds.DataPath,
		&ds.TrainFile, &ds.EvalFile, &ds.TestFile, &config, &ds.Status, &ds.IsActive, &ds.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, ErrDatasetNotFound
	}
	if err != nil {
		return nil, err
	}
	
	if config.Valid {
		ds.Config = json.RawMessage(config.String)
	}
	
	return ds, nil
}

func (r *TrainingRepository) ListDatasets(limit, offset int) ([]*models.Dataset, error) {
	query := `
		SELECT dataset_id, name, version, description, total_samples, train_samples, eval_samples,
		       test_samples, status, is_active, created_at
		FROM datasets
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var datasets []*models.Dataset
	for rows.Next() {
		ds := &models.Dataset{}
		err := rows.Scan(
			&ds.DatasetID, &ds.Name, &ds.Version, &ds.Description, &ds.TotalSamples,
			&ds.TrainSamples, &ds.EvalSamples, &ds.TestSamples, &ds.Status, &ds.IsActive, &ds.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		datasets = append(datasets, ds)
	}
	
	return datasets, rows.Err()
}

func (r *TrainingRepository) UpdateDatasetStatus(id int64, status string) error {
	query := `UPDATE datasets SET status = $2 WHERE dataset_id = $1`
	_, err := r.db.Exec(query, id, status)
	return err
}

func (r *TrainingRepository) SetActiveDataset(id int64) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	
	// Deactivate all datasets
	_, err = tx.Exec(`UPDATE datasets SET is_active = false`)
	if err != nil {
		return err
	}
	
	// Activate selected dataset
	_, err = tx.Exec(`UPDATE datasets SET is_active = true WHERE dataset_id = $1`, id)
	if err != nil {
		return err
	}
	
	return tx.Commit()
}

// ============================================================
// Models
// ============================================================

func (r *TrainingRepository) CreateModel(m *models.Model) error {
	query := `
		INSERT INTO models (name, version, description, base_model, model_type, model_path,
		                    adapter_path, training_run_id, dataset_id, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING model_id, created_at
	`
	return r.db.QueryRow(query,
		m.Name, m.Version, m.Description, m.BaseModel, m.ModelType, m.ModelPath,
		m.AdapterPath, m.TrainingRunID, m.DatasetID, m.CreatedBy,
	).Scan(&m.ModelID, &m.CreatedAt)
}

func (r *TrainingRepository) GetModel(id int64) (*models.Model, error) {
	query := `
		SELECT model_id, name, version, description, base_model, model_type, model_path,
		       adapter_path, merged_model_path, training_run_id, dataset_id, eval_metrics,
		       benchmark_scores, is_active, is_production, deployed_at, ollama_model_name,
		       ollama_imported, created_at
		FROM models WHERE model_id = $1
	`
	m := &models.Model{}
	var evalMetrics, benchmarkScores sql.NullString
	
	err := r.db.QueryRow(query, id).Scan(
		&m.ModelID, &m.Name, &m.Version, &m.Description, &m.BaseModel, &m.ModelType,
		&m.ModelPath, &m.AdapterPath, &m.MergedModelPath, &m.TrainingRunID, &m.DatasetID,
		&evalMetrics, &benchmarkScores, &m.IsActive, &m.IsProduction, &m.DeployedAt,
		&m.OllamaModelName, &m.OllamaImported, &m.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, ErrModelNotFound
	}
	if err != nil {
		return nil, err
	}
	
	if evalMetrics.Valid {
		m.EvalMetrics = json.RawMessage(evalMetrics.String)
	}
	if benchmarkScores.Valid {
		m.BenchmarkScores = json.RawMessage(benchmarkScores.String)
	}
	
	return m, nil
}

func (r *TrainingRepository) ListModels(limit, offset int) ([]*models.Model, error) {
	query := `
		SELECT model_id, name, version, description, base_model, model_type, model_path,
		       is_active, is_production, deployed_at, ollama_model_name, created_at
		FROM models
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modelsResult []*models.Model
	for rows.Next() {
		m := &models.Model{}
		err := rows.Scan(
			&m.ModelID, &m.Name, &m.Version, &m.Description, &m.BaseModel, &m.ModelType,
			&m.ModelPath, &m.IsActive, &m.IsProduction, &m.DeployedAt, &m.OllamaModelName,
			&m.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		modelsResult = append(modelsResult, m)
	}
	
	return modelsResult, rows.Err()
}

func (r *TrainingRepository) GetActiveModel() (*models.Model, error) {
	query := `
		SELECT model_id, name, version, description, base_model, model_type, model_path,
		       adapter_path, ollama_model_name, created_at
		FROM models WHERE is_active = true LIMIT 1
	`
	m := &models.Model{}
	err := r.db.QueryRow(query).Scan(
		&m.ModelID, &m.Name, &m.Version, &m.Description, &m.BaseModel, &m.ModelType,
		&m.ModelPath, &m.AdapterPath, &m.OllamaModelName, &m.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, ErrModelNotFound
	}
	return m, err
}

func (r *TrainingRepository) ActivateModel(id int64, ollamaName string, isProduction bool) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	
	// Deactivate all active models
	_, err = tx.Exec(`UPDATE models SET is_active = false WHERE is_active = true`)
	if err != nil {
		return err
	}
	
	// Activate selected model
	deployedAt := time.Now()
	_, err = tx.Exec(`
		UPDATE models 
		SET is_active = true, is_production = $2, deployed_at = $3, ollama_model_name = $4, ollama_imported = true
		WHERE model_id = $1
	`, id, isProduction, deployedAt, ollamaName)
	if err != nil {
		return err
	}
	
	return tx.Commit()
}

func (r *TrainingRepository) UpdateModelMetrics(id int64, evalMetrics, benchmarkScores json.RawMessage) error {
	query := `UPDATE models SET eval_metrics = $2, benchmark_scores = $3 WHERE model_id = $1`
	_, err := r.db.Exec(query, id, evalMetrics, benchmarkScores)
	return err
}

// ============================================================
// Evaluations
// ============================================================

func (r *TrainingRepository) CreateEvaluation(e *models.Evaluation) error {
	query := `
		INSERT INTO evaluations (model_id, dataset_id, eval_type, metrics, passed,
		                         code_tests_total, code_tests_passed, code_tests_failed,
		                         detailed_results, duration_seconds)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING eval_id, created_at
	`
	return r.db.QueryRow(query,
		e.ModelID, e.DatasetID, e.EvalType, e.Metrics, e.Passed,
		e.CodeTestsTotal, e.CodeTestsPassed, e.CodeTestsFailed,
		e.DetailedResults, e.DurationSeconds,
	).Scan(&e.EvalID, &e.CreatedAt)
}

func (r *TrainingRepository) GetEvaluation(id int64) (*models.Evaluation, error) {
	query := `
		SELECT eval_id, model_id, dataset_id, eval_type, metrics, passed,
		       code_tests_total, code_tests_passed, code_tests_failed,
		       detailed_results, created_at, duration_seconds
		FROM evaluations WHERE eval_id = $1
	`
	e := &models.Evaluation{}
	var metrics, detailedResults sql.NullString
	
	err := r.db.QueryRow(query, id).Scan(
		&e.EvalID, &e.ModelID, &e.DatasetID, &e.EvalType, &metrics, &e.Passed,
		&e.CodeTestsTotal, &e.CodeTestsPassed, &e.CodeTestsFailed,
		&detailedResults, &e.CreatedAt, &e.DurationSeconds,
	)
	if err == sql.ErrNoRows {
		return nil, ErrEvaluationNotFound
	}
	if err != nil {
		return nil, err
	}
	
	if metrics.Valid {
		e.Metrics = json.RawMessage(metrics.String)
	}
	if detailedResults.Valid {
		e.DetailedResults = json.RawMessage(detailedResults.String)
	}
	
	return e, nil
}

func (r *TrainingRepository) ListEvaluationsByModel(modelID int64) ([]*models.Evaluation, error) {
	query := `
		SELECT eval_id, model_id, dataset_id, eval_type, metrics, passed,
		       code_tests_total, code_tests_passed, code_tests_failed, created_at
		FROM evaluations WHERE model_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(query, modelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var evals []*models.Evaluation
	for rows.Next() {
		e := &models.Evaluation{}
		var metrics sql.NullString
		
		err := rows.Scan(
			&e.EvalID, &e.ModelID, &e.DatasetID, &e.EvalType, &metrics, &e.Passed,
			&e.CodeTestsTotal, &e.CodeTestsPassed, &e.CodeTestsFailed, &e.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		
		if metrics.Valid {
			e.Metrics = json.RawMessage(metrics.String)
		}
		
		evals = append(evals, e)
	}
	
	return evals, rows.Err()
}
