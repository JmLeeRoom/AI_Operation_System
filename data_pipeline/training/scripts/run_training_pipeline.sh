#!/bin/bash
# Complete Training Pipeline Script
# Runs: Dataset Build → Training → Evaluation → Model Deployment
#
# Usage:
#   ./run_training_pipeline.sh [options]
#
# Options:
#   --run-id          Training run ID (default: auto-generated)
#   --base-model      Base model (default: codellama/CodeLlama-7b-hf)
#   --dataset-version Dataset version (default: v1.0)
#   --skip-dataset    Skip dataset building
#   --skip-eval       Skip evaluation
#   --skip-deploy     Skip deployment to Ollama
#   --local           Run locally (not in K8s)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Default values
RUN_ID="${RUN_ID:-$(date +%Y%m%d_%H%M%S)}"
BASE_MODEL="${BASE_MODEL:-codellama/CodeLlama-7b-hf}"
DATASET_VERSION="${DATASET_VERSION:-v1.0}"
DATASET_NAME="${DATASET_NAME:-codegen}"
DATA_DIR="${DATA_DIR:-/data}"
SKIP_DATASET="${SKIP_DATASET:-false}"
SKIP_EVAL="${SKIP_EVAL:-false}"
SKIP_DEPLOY="${SKIP_DEPLOY:-false}"
RUN_LOCAL="${RUN_LOCAL:-true}"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --run-id)
            RUN_ID="$2"
            shift 2
            ;;
        --base-model)
            BASE_MODEL="$2"
            shift 2
            ;;
        --dataset-version)
            DATASET_VERSION="$2"
            shift 2
            ;;
        --skip-dataset)
            SKIP_DATASET=true
            shift
            ;;
        --skip-eval)
            SKIP_EVAL=true
            shift
            ;;
        --skip-deploy)
            SKIP_DEPLOY=true
            shift
            ;;
        --local)
            RUN_LOCAL=true
            shift
            ;;
        --k8s)
            RUN_LOCAL=false
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Paths
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATASET_PATH="${DATA_DIR}/datasets/${DATASET_NAME}/${DATASET_VERSION}"
OUTPUT_DIR="${DATA_DIR}/models/run_${RUN_ID}"
EVAL_OUTPUT="${DATA_DIR}/evaluations/run_${RUN_ID}_eval.json"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  ML Training Pipeline${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  Run ID:          ${RUN_ID}"
echo "  Base Model:      ${BASE_MODEL}"
echo "  Dataset:         ${DATASET_NAME}/${DATASET_VERSION}"
echo "  Output Dir:      ${OUTPUT_DIR}"
echo "  Run Mode:        $(if [ "$RUN_LOCAL" = true ]; then echo 'Local'; else echo 'K8s'; fi)"
echo ""

# ============================================================
# Step 1: Build Dataset (if not skipping)
# ============================================================
if [ "$SKIP_DATASET" = false ]; then
    echo -e "${YELLOW}Step 1: Building Dataset${NC}"
    
    if [ -d "${DATASET_PATH}" ] && [ -f "${DATASET_PATH}/train.jsonl" ]; then
        echo -e "${GREEN}Dataset already exists at ${DATASET_PATH}${NC}"
        read -p "Rebuild dataset? (y/N): " REBUILD
        if [ "$REBUILD" != "y" ] && [ "$REBUILD" != "Y" ]; then
            echo "Skipping dataset build"
        else
            python3 "${SCRIPTS_DIR}/build_dataset.py" \
                --source feedbacks \
                --db_url "${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/data_pipeline}" \
                --output_dir "${DATA_DIR}/datasets" \
                --name "${DATASET_NAME}" \
                --version "${DATASET_VERSION}" \
                --min_rating 3 \
                --accepted_only
        fi
    else
        python3 "${SCRIPTS_DIR}/build_dataset.py" \
            --source feedbacks \
            --db_url "${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/data_pipeline}" \
            --output_dir "${DATA_DIR}/datasets" \
            --name "${DATASET_NAME}" \
            --version "${DATASET_VERSION}" \
            --min_rating 3 \
            --accepted_only
    fi
    
    echo -e "${GREEN}✓ Dataset ready${NC}"
    echo ""
else
    echo -e "${YELLOW}Step 1: Skipping Dataset Build${NC}"
    echo ""
fi

# Check dataset exists
if [ ! -f "${DATASET_PATH}/train.jsonl" ]; then
    echo -e "${RED}Error: Training data not found at ${DATASET_PATH}/train.jsonl${NC}"
    echo "Run without --skip-dataset to build the dataset"
    exit 1
fi

# ============================================================
# Step 2: Run Training
# ============================================================
echo -e "${YELLOW}Step 2: Training Model${NC}"
echo "  Base Model: ${BASE_MODEL}"
echo "  Dataset: ${DATASET_PATH}"
echo "  Output: ${OUTPUT_DIR}"
echo ""

mkdir -p "${OUTPUT_DIR}"

if [ "$RUN_LOCAL" = true ]; then
    # Run training locally
    echo "Starting local training..."
    
    python3 "${SCRIPTS_DIR}/train_qlora.py" \
        --base_model "${BASE_MODEL}" \
        --dataset_path "${DATASET_PATH}" \
        --output_dir "${OUTPUT_DIR}" \
        --num_epochs 3 \
        --batch_size 4 \
        --gradient_accumulation_steps 4 \
        --learning_rate 2e-4 \
        --lora_r 16 \
        --lora_alpha 32
    
    TRAIN_EXIT_CODE=$?
else
    # Run training in K8s
    echo "Submitting K8s training job..."
    
    export RUN_ID BASE_MODEL DATASET_PATH
    envsubst < "${SCRIPTS_DIR}/../k8s/09-training-job.yaml" | kubectl apply -f -
    
    echo "Waiting for training job to complete..."
    kubectl wait --for=condition=complete --timeout=3600s \
        job/training-job-${RUN_ID} -n data-pipeline
    
    TRAIN_EXIT_CODE=$?
fi

if [ $TRAIN_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}✗ Training failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Training completed${NC}"
echo ""

# ============================================================
# Step 3: Evaluate Model (if not skipping)
# ============================================================
if [ "$SKIP_EVAL" = false ]; then
    echo -e "${YELLOW}Step 3: Evaluating Model${NC}"
    
    mkdir -p "$(dirname ${EVAL_OUTPUT})"
    
    python3 "${SCRIPTS_DIR}/evaluate_model.py" \
        --model_path "${OUTPUT_DIR}" \
        --base_model "${BASE_MODEL}" \
        --test_file "${DATASET_PATH}/test.jsonl" \
        --output_file "${EVAL_OUTPUT}" \
        --max_samples 50 \
        --run_code_tests
    
    EVAL_EXIT_CODE=$?
    
    if [ $EVAL_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}✗ Evaluation failed (pass rate below threshold)${NC}"
        echo "Model will NOT be deployed"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Evaluation passed${NC}"
    echo ""
else
    echo -e "${YELLOW}Step 3: Skipping Evaluation${NC}"
    echo ""
fi

# ============================================================
# Step 4: Merge Adapter
# ============================================================
echo -e "${YELLOW}Step 4: Merging Adapter${NC}"

MERGED_DIR="${OUTPUT_DIR}_merged"

python3 "${SCRIPTS_DIR}/merge_adapter.py" \
    --base_model "${BASE_MODEL}" \
    --adapter_path "${OUTPUT_DIR}" \
    --output_path "${MERGED_DIR}"

echo -e "${GREEN}✓ Adapter merged${NC}"
echo ""

# ============================================================
# Step 5: Deploy to Ollama (if not skipping)
# ============================================================
if [ "$SKIP_DEPLOY" = false ]; then
    echo -e "${YELLOW}Step 5: Deploying to Ollama${NC}"
    
    OLLAMA_MODEL_NAME="codegen-${RUN_ID}"
    
    python3 "${SCRIPTS_DIR}/convert_to_ollama.py" \
        --model_path "${MERGED_DIR}" \
        --ollama_name "${OLLAMA_MODEL_NAME}" \
        --quantization q4_k_m \
        --output_dir "${DATA_DIR}/models/gguf"
    
    echo -e "${GREEN}✓ Model deployed to Ollama as: ${OLLAMA_MODEL_NAME}${NC}"
    echo ""
else
    echo -e "${YELLOW}Step 5: Skipping Deployment${NC}"
    echo ""
fi

# ============================================================
# Summary
# ============================================================
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Pipeline Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Results:"
echo "  Run ID:        ${RUN_ID}"
echo "  Model Path:    ${OUTPUT_DIR}"
echo "  Merged Model:  ${MERGED_DIR}"
echo "  Evaluation:    ${EVAL_OUTPUT}"

if [ "$SKIP_DEPLOY" = false ]; then
    echo "  Ollama Model:  codegen-${RUN_ID}"
fi

echo ""
echo -e "${GREEN}Done!${NC}"
