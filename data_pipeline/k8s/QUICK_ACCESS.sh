#!/bin/bash

# Data Pipeline 빠른 접근 스크립트

echo "=========================================="
echo "Data Pipeline Quick Access"
echo "=========================================="

# Minikube IP 확인
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"

# Pod 상태 확인
echo -e "\nPod Status:"
kubectl get pods -n data-pipeline

# 접근 방법 안내
echo -e "\n=========================================="
echo "Access Methods:"
echo "=========================================="

echo -e "\n1. Minikube Tunnel (Recommended):"
echo "   Run in separate terminal: minikube tunnel"
echo "   Then access:"
echo "   - Frontend: http://data-pipeline.local"
echo "   - Backend: http://api.data-pipeline.local"

echo -e "\n2. Port Forwarding:"
echo "   kubectl port-forward -n data-pipeline service/frontend-service 8080:80"
echo "   kubectl port-forward -n data-pipeline service/backend-service 8081:8080"
echo "   Then access:"
echo "   - Frontend: http://localhost:8080"
echo "   - Backend: http://localhost:8081"

echo -e "\n3. Add to /etc/hosts:"
echo "   sudo echo \"$MINIKUBE_IP data-pipeline.local\" >> /etc/hosts"
echo "   sudo echo \"$MINIKUBE_IP api.data-pipeline.local\" >> /etc/hosts"
echo "   sudo echo \"$MINIKUBE_IP app.data-pipeline.local\" >> /etc/hosts"

echo -e "\n=========================================="
