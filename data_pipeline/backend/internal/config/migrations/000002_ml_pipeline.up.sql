-- Migration: ML Pipeline tables for training, evaluation, and model management
-- Tables: training_runs, feedbacks, datasets, models, evaluations

-- ============================================================
-- 1. Training Runs: 학습 작업 기록
-- ============================================================
CREATE TABLE IF NOT EXISTS training_runs (
    run_id BIGSERIAL PRIMARY KEY,
    
    -- 기본 정보
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, running, completed, failed, cancelled
    
    -- 모델 설정
    base_model VARCHAR(255) NOT NULL DEFAULT 'codellama/CodeLlama-7b-hf',
    model_type VARCHAR(50) DEFAULT 'qlora',  -- qlora, lora, full
    
    -- 학습 하이퍼파라미터 (JSON)
    hyperparameters JSONB DEFAULT '{
        "learning_rate": 2e-4,
        "num_epochs": 3,
        "batch_size": 4,
        "gradient_accumulation_steps": 4,
        "lora_r": 16,
        "lora_alpha": 32,
        "lora_dropout": 0.05,
        "max_seq_length": 2048,
        "warmup_ratio": 0.03
    }'::jsonb,
    
    -- 데이터셋 참조
    dataset_id BIGINT,
    dataset_version VARCHAR(50),
    
    -- 실행 정보
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    
    -- 결과
    output_model_path VARCHAR(500),
    metrics JSONB,  -- {"train_loss": 0.5, "eval_loss": 0.4, ...}
    error_message TEXT,
    
    -- GPU 정보
    gpu_info JSONB,  -- {"gpu_count": 2, "gpu_type": "RTX 2080 Ti", "vram_gb": 11}
    
    -- 메타데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    
    CONSTRAINT chk_status CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled'))
);

-- ============================================================
-- 2. Feedbacks: 사용자 피드백 및 실행 로그
-- ============================================================
CREATE TABLE IF NOT EXISTS feedbacks (
    feedback_id BIGSERIAL PRIMARY KEY,
    
    -- 피드백 타입
    feedback_type VARCHAR(50) NOT NULL DEFAULT 'code_generation',  -- code_generation, code_modification, explanation, execution
    
    -- 입력/출력
    input_prompt TEXT NOT NULL,
    input_code TEXT,
    output_code TEXT,
    output_explanation TEXT,
    
    -- 실행 컨텍스트
    execution_success BOOLEAN,
    execution_output TEXT,
    execution_error TEXT,
    
    -- 평가
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),  -- 1-5 점수
    is_accepted BOOLEAN,  -- 사용자가 결과를 수락했는지
    user_correction TEXT,  -- 사용자가 수정한 코드
    
    -- 메타데이터
    session_id VARCHAR(255),
    node_id VARCHAR(255),
    flow_id BIGINT,
    model_version VARCHAR(100),
    
    -- 학습 데이터로 사용 여부
    used_for_training BOOLEAN DEFAULT FALSE,
    dataset_id BIGINT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_flow FOREIGN KEY (flow_id) REFERENCES flows(f_id) ON DELETE SET NULL
);

-- ============================================================
-- 3. Datasets: 학습 데이터셋 버전 관리
-- ============================================================
CREATE TABLE IF NOT EXISTS datasets (
    dataset_id BIGSERIAL PRIMARY KEY,
    
    -- 기본 정보
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- 데이터 통계
    total_samples INTEGER DEFAULT 0,
    train_samples INTEGER DEFAULT 0,
    eval_samples INTEGER DEFAULT 0,
    test_samples INTEGER DEFAULT 0,
    
    -- 파일 경로
    data_path VARCHAR(500),  -- /data/datasets/v1.0/
    train_file VARCHAR(255),  -- train.jsonl
    eval_file VARCHAR(255),   -- eval.jsonl
    test_file VARCHAR(255),   -- test.jsonl
    
    -- 데이터 설정
    config JSONB DEFAULT '{
        "format": "jsonl",
        "prompt_template": "alpaca",
        "max_length": 2048,
        "dedup_enabled": true,
        "filter_min_length": 10
    }'::jsonb,
    
    -- 상태
    status VARCHAR(50) DEFAULT 'building',  -- building, ready, archived
    is_active BOOLEAN DEFAULT FALSE,
    
    -- 메타데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    
    CONSTRAINT uq_dataset_version UNIQUE (name, version),
    CONSTRAINT chk_dataset_status CHECK (status IN ('building', 'ready', 'archived'))
);

-- ============================================================
-- 4. Models: 학습된 모델 레지스트리
-- ============================================================
CREATE TABLE IF NOT EXISTS models (
    model_id BIGSERIAL PRIMARY KEY,
    
    -- 기본 정보
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- 모델 정보
    base_model VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) DEFAULT 'qlora',  -- qlora, lora, merged
    
    -- 파일 경로
    model_path VARCHAR(500) NOT NULL,  -- /models/codegen-v1.0/
    adapter_path VARCHAR(500),  -- LoRA adapter 경로
    merged_model_path VARCHAR(500),  -- 병합된 모델 경로
    
    -- 학습 참조
    training_run_id BIGINT,
    dataset_id BIGINT,
    
    -- 평가 결과
    eval_metrics JSONB,  -- {"accuracy": 0.85, "pass_rate": 0.78, ...}
    benchmark_scores JSONB,  -- {"humaneval": 45.2, "mbpp": 52.1}
    
    -- 배포 상태
    is_active BOOLEAN DEFAULT FALSE,  -- 현재 서빙 중인 모델
    is_production BOOLEAN DEFAULT FALSE,  -- 프로덕션 배포 여부
    deployed_at TIMESTAMP,
    
    -- Ollama 연동
    ollama_model_name VARCHAR(255),  -- ollama에 등록된 이름
    ollama_imported BOOLEAN DEFAULT FALSE,
    
    -- 메타데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    
    CONSTRAINT uq_model_version UNIQUE (name, version),
    CONSTRAINT fk_training_run FOREIGN KEY (training_run_id) REFERENCES training_runs(run_id) ON DELETE SET NULL,
    CONSTRAINT fk_dataset FOREIGN KEY (dataset_id) REFERENCES datasets(dataset_id) ON DELETE SET NULL
);

-- ============================================================
-- 5. Evaluations: 모델 평가 기록
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluations (
    eval_id BIGSERIAL PRIMARY KEY,
    
    -- 참조
    model_id BIGINT NOT NULL,
    dataset_id BIGINT,
    
    -- 평가 타입
    eval_type VARCHAR(50) NOT NULL DEFAULT 'automated',  -- automated, manual, benchmark
    
    -- 결과
    metrics JSONB NOT NULL,  -- {"accuracy": 0.85, "f1": 0.82, ...}
    passed BOOLEAN,  -- 평가 통과 여부
    
    -- 코드 실행 테스트
    code_tests_total INTEGER DEFAULT 0,
    code_tests_passed INTEGER DEFAULT 0,
    code_tests_failed INTEGER DEFAULT 0,
    
    -- 상세 결과
    detailed_results JSONB,  -- 개별 테스트 케이스 결과
    
    -- 메타데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INTEGER,
    
    CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES models(model_id) ON DELETE CASCADE,
    CONSTRAINT fk_eval_dataset FOREIGN KEY (dataset_id) REFERENCES datasets(dataset_id) ON DELETE SET NULL
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_training_runs_status ON training_runs(status);
CREATE INDEX IF NOT EXISTS idx_training_runs_created_at ON training_runs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedbacks_type ON feedbacks(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks(rating);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_used_for_training ON feedbacks(used_for_training);

CREATE INDEX IF NOT EXISTS idx_datasets_status ON datasets(status);
CREATE INDEX IF NOT EXISTS idx_datasets_active ON datasets(is_active);

CREATE INDEX IF NOT EXISTS idx_models_active ON models(is_active);
CREATE INDEX IF NOT EXISTS idx_models_production ON models(is_production);

CREATE INDEX IF NOT EXISTS idx_evaluations_model ON evaluations(model_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_passed ON evaluations(passed);
