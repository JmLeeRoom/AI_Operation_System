#!/bin/bash

# Port forwarding script for Data Pipeline services

set -e

echo "=========================================="
echo "Data Pipeline Port Forwarding"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill existing port-forwards
echo -e "${YELLOW}Stopping existing port-forwards...${NC}"
pkill -f "kubectl port-forward" || true
sleep 1

# Start port-forwards
echo -e "\n${YELLOW}Starting port-forwards...${NC}"

echo -e "${GREEN}Frontend: http://localhost:8080${NC}"
kubectl port-forward -n data-pipeline service/frontend-service 8080:80 > /dev/null 2>&1 &

echo -e "${GREEN}Backend: http://localhost:8081${NC}"
kubectl port-forward -n data-pipeline service/backend-service 8081:8080 > /dev/null 2>&1 &

echo -e "${GREEN}Jupyter: http://localhost:8888${NC}"
kubectl port-forward -n data-pipeline service/jupyter-service 8888:8888 > /dev/null 2>&1 &

echo -e "${GREEN}Ollama: http://localhost:11434${NC}"
kubectl port-forward -n data-pipeline service/ollama-service 11434:11434 > /dev/null 2>&1 &

sleep 2

echo -e "\n${GREEN}✓ Port forwarding started${NC}"
echo -e "\n${YELLOW}Access URLs:${NC}"
echo -e "  Frontend:  http://localhost:8080"
echo -e "  Backend:   http://localhost:8081"
echo -e "  Jupyter:   http://localhost:8888"
echo -e "  Ollama:    http://localhost:11434"
echo -e "\n${YELLOW}To stop port-forwarding, run:${NC}"
echo -e "  pkill -f 'kubectl port-forward'"
