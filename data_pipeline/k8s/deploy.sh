#!/bin/bash

set -e

echo "=========================================="
echo "Data Pipeline K8s Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: docker is not installed${NC}"
    exit 1
fi

# Check K8s cluster connection
echo -e "${YELLOW}Checking K8s cluster connection...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to K8s cluster${NC}"
    echo -e "${YELLOW}Please ensure your K8s cluster is running${NC}"
    echo -e "${YELLOW}For minikube: minikube start${NC}"
    echo -e "${YELLOW}For kind: kind create cluster${NC}"
    exit 1
fi

echo -e "${GREEN}✓ K8s cluster is accessible${NC}"

# Get project root directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Build Docker images
echo -e "\n${YELLOW}Building Docker images...${NC}"

echo -e "${YELLOW}Building backend image...${NC}"
cd "$PROJECT_ROOT/backend"
docker build -t data-pipeline-backend:latest .

echo -e "${YELLOW}Building frontend image...${NC}"
cd "$PROJECT_ROOT/frontend"
docker build -t data-pipeline-frontend:latest .

# Build training image (optional - only if training directory exists)
if [ -d "$PROJECT_ROOT/training" ] && [ -f "$PROJECT_ROOT/training/Dockerfile" ]; then
    echo -e "${YELLOW}Building training image...${NC}"
    cd "$PROJECT_ROOT/training"
    docker build -t data-pipeline-training:latest . || echo -e "${YELLOW}Training image build skipped (GPU dependencies may not be available)${NC}"
fi

echo -e "${GREEN}✓ Docker images built successfully${NC}"

# Load images into K8s (for minikube/kind)
if command -v minikube &> /dev/null && minikube status &> /dev/null; then
    echo -e "\n${YELLOW}Loading images into minikube...${NC}"
    minikube image load data-pipeline-backend:latest
    minikube image load data-pipeline-frontend:latest
    if docker images | grep -q data-pipeline-training; then
        minikube image load data-pipeline-training:latest || true
    fi
    echo -e "${GREEN}✓ Images loaded into minikube${NC}"
elif command -v kind &> /dev/null && kind get clusters &> /dev/null; then
    echo -e "\n${YELLOW}Loading images into kind...${NC}"
    kind load docker-image data-pipeline-backend:latest
    kind load docker-image data-pipeline-frontend:latest
    if docker images | grep -q data-pipeline-training; then
        kind load docker-image data-pipeline-training:latest || true
    fi
    echo -e "${GREEN}✓ Images loaded into kind${NC}"
else
    echo -e "${YELLOW}Note: If using minikube or kind, you may need to load images manually${NC}"
fi

# Apply K8s manifests
echo -e "\n${YELLOW}Applying K8s manifests...${NC}"
cd "$SCRIPT_DIR"

# Apply in order
echo -e "${YELLOW}1. Creating namespace...${NC}"
kubectl apply -f 00-namespace.yaml

echo -e "${YELLOW}2. Creating secrets...${NC}"
kubectl apply -f 01-secrets.yaml

echo -e "${YELLOW}3. Creating configmap...${NC}"
kubectl apply -f 02-configmap.yaml

echo -e "${YELLOW}4. Creating PostgreSQL PV...${NC}"
kubectl apply -f 03-postgres-pv.yaml

echo -e "${YELLOW}5. Deploying PostgreSQL...${NC}"
kubectl apply -f 03-postgres-statefulset.yaml

echo -e "${YELLOW}6. Waiting for PostgreSQL to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=postgres -n data-pipeline --timeout=300s

echo -e "${YELLOW}7. Deploying backend...${NC}"
kubectl apply -f 04-backend-deployment.yaml

echo -e "${YELLOW}8. Deploying frontend...${NC}"
kubectl apply -f 05-frontend-deployment.yaml

echo -e "${YELLOW}9. Deploying Jupyter...${NC}"
kubectl apply -f 07-jupyter-deployment.yaml

echo -e "${YELLOW}10. Deploying Ollama...${NC}"
kubectl apply -f 08-ollama-deployment.yaml

echo -e "${YELLOW}11. Waiting for Ollama to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=ollama -n data-pipeline --timeout=300s || true

echo -e "${YELLOW}12. Loading Qwen2.5-Coder model into Ollama...${NC}"
OLLAMA_POD=$(kubectl get pod -n data-pipeline -l app=ollama -o jsonpath='{.items[0].metadata.name}')
if [ -n "$OLLAMA_POD" ]; then
  kubectl exec -n data-pipeline $OLLAMA_POD -- ollama pull qwen2.5-coder:7b || echo "Model pull will happen on first use"
fi

echo -e "${YELLOW}13. Creating ingress...${NC}"
kubectl apply -f 06-ingress.yaml

echo -e "\n${GREEN}✓ All resources deployed successfully${NC}"

# Wait for pods to be ready
echo -e "\n${YELLOW}Waiting for pods to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=backend -n data-pipeline --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=frontend -n data-pipeline --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=jupyter -n data-pipeline --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=ollama -n data-pipeline --timeout=300s || true

# Show Ollama status
echo -e "\n${YELLOW}Ollama Pod Status:${NC}"
kubectl get pods -n data-pipeline -l app=ollama

# Show status
echo -e "\n${GREEN}Deployment Status:${NC}"
kubectl get pods -n data-pipeline

echo -e "\n${GREEN}Services:${NC}"
kubectl get svc -n data-pipeline

echo -e "\n${GREEN}Ingress:${NC}"
kubectl get ingress -n data-pipeline

echo -e "\n${YELLOW}Access URLs:${NC}"
echo -e "Frontend: http://data-pipeline.local"
echo -e "Backend API: http://api.data-pipeline.local"
echo -e "Alternative: http://data-pipeline.local/api"

echo -e "\n${YELLOW}To access from your host, add to /etc/hosts:${NC}"
echo -e "127.0.0.1 data-pipeline.local"
echo -e "127.0.0.1 api.data-pipeline.local"
echo -e "127.0.0.1 app.data-pipeline.local"

echo -e "\n${YELLOW}Training (local GPU recommended):${NC}"
echo -e "For ML training, use local GPU instead of K8s:"
echo -e "  cd $PROJECT_ROOT/training"
echo -e "  pip install -r requirements.txt"
echo -e "  ./scripts/run_training_pipeline.sh --local"

echo -e "\n${GREEN}Deployment completed!${NC}"
