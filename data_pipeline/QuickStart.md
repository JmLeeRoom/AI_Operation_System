# Data Pipeline

> Kubernetes 기반 데이터 파이프라인 플랫폼 with AI 코드 생성

시각적 DAG 에디터로 데이터 파이프라인을 설계하고, AI가 코드를 자동 생성하며, Kubernetes에서 실행하는 통합 플랫폼입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **DAG Editor** | 드래그 앤 드롭으로 데이터 파이프라인 설계 |
| **Agent Lab** | AI가 자연어 명령으로 Python 코드 자동 생성 |
| **Python 실행** | Jupyter 연동으로 실시간 코드 실행 및 디버깅 |
| **K8s 배포** | Knative/Kafka 기반 이벤트 드리븐 파이프라인 (선택) |

---

## 시스템 요구사항

| 항목 | 최소 요구사항 |
|------|-------------|
| OS | Linux (Ubuntu 20.04+) |
| Docker | 20.10+ |
| Kubernetes | Minikube 또는 K8s 클러스터 |
| CPU | 4 cores |
| Memory | 8GB RAM |

---

## 빠른 시작

### 1. Minikube 시작

```bash
minikube start --cpus=4 --memory=8192
minikube addons enable ingress
```

### 2. Docker 이미지 빌드

```bash
# Backend
cd backend
docker build -t data-pipeline-backend:v1.4.0 .

# Frontend
cd ../frontend
docker build -t data-pipeline-frontend:v1.4.0 .
```

### 3. Minikube에 이미지 로드

```bash
minikube image load data-pipeline-backend:v1.4.0
minikube image load data-pipeline-frontend:v1.4.0
```

### 4. K8s 배포

```bash
cd k8s
./deploy.sh
```

### 5. 접속

```bash
# Port Forward 설정
kubectl port-forward svc/frontend-service 3000:80 -n data-pipeline &
kubectl port-forward svc/backend-service 8080:8080 -n data-pipeline &
```

**접속 URL: http://localhost:3000**

---

## 프로젝트 구조

```
data_pipeline/
├── backend/          # Go 백엔드 서버
│   ├── cmd/          # 메인 엔트리포인트
│   ├── internal/     # 핸들러, 서비스, 레포지토리
│   └── Dockerfile
├── frontend/         # React 프론트엔드
│   ├── src/
│   │   ├── components/   # UI 컴포넌트
│   │   └── services/     # API 서비스
│   └── Dockerfile
├── k8s/              # Kubernetes 매니페스트
│   ├── 00-namespace.yaml
│   ├── 01-secrets.yaml
│   ├── 02-configmap.yaml
│   ├── 03-postgres-*.yaml
│   ├── 04-backend-deployment.yaml
│   ├── 05-frontend-deployment.yaml
│   ├── 06-ingress.yaml
│   ├── 07-jupyter-deployment.yaml
│   ├── 08-ollama-deployment.yaml
│   └── deploy.sh
├── training/         # ML 모델 학습 스크립트
├── Sample/           # 샘플 데이터
└── docs/             # 상세 문서
```

---

## 서비스 구성

| 서비스 | 포트 | 설명 |
|--------|------|------|
| Frontend | 3000 (80) | React 웹 UI |
| Backend | 8080 | Go REST API |
| PostgreSQL | 5432 | 데이터베이스 |
| Jupyter | 8888 | Python 실행 환경 |
| Ollama | 11434 | AI 모델 서빙 |

---

## API 엔드포인트

### 기본 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/flows` | 모든 Flow 조회 |
| POST | `/api/flows` | Flow 생성 |
| GET | `/api/objects` | 모든 Object 조회 |
| POST | `/api/python/execute` | Python 코드 실행 |
| POST | `/api/ai/generate` | AI 코드 생성 |

### K8s 배포 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/k8s/deploy/stream` | SSE로 배포 진행 스트리밍 |
| POST | `/api/k8s/test` | 단일 스텝 유닛 테스트 |
| DELETE | `/api/k8s/delete` | Flow 리소스 삭제 |

---

## 샘플 데이터 사용

```bash
# 샘플 데이터를 Minikube에 복사
minikube cp Sample/input.csv /data/sample/input.csv

# Data Node에서 사용할 경로
/data/sample/input.csv
```

---

## 환경 변수

### Backend 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DB_HOST` | postgres-service | PostgreSQL 호스트 |
| `DB_PORT` | 5432 | PostgreSQL 포트 |
| `DB_NAME` | datapipeline | 데이터베이스 이름 |
| `JUPYTER_URL` | http://jupyter-service:8888 | Jupyter URL |
| `OLLAMA_URL` | http://ollama-service:11434 | Ollama URL |

---

## 문제 해결

### 이전 버전이 표시되는 경우
```bash
# 브라우저 강력 새로고침
Ctrl + Shift + R
```

### Pod가 시작되지 않는 경우
```bash
kubectl describe pod <pod-name> -n data-pipeline
kubectl logs <pod-name> -n data-pipeline
```

### Port Forward 재시작
```bash
pkill -f "kubectl port-forward"
kubectl port-forward svc/frontend-service 3000:80 -n data-pipeline &
kubectl port-forward svc/backend-service 8080:8080 -n data-pipeline &
```

### 전체 재시작
```bash
kubectl rollout restart deployment -n data-pipeline
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React, TypeScript, ReactFlow, Monaco Editor |
| Backend | Go, Gorilla Mux, client-go |
| Database | PostgreSQL |
| AI | Ollama (qwen2.5-coder:7b) |
| Python 실행 | Jupyter Notebook |
| Container | Docker, Kubernetes, Minikube |
| CI/CD | Knative Serving, Strimzi Kafka (선택) |

---

## 라이선스

MIT License

---

## 버전 정보

- **현재 버전**: v1.4.0
- **마지막 업데이트**: 2026-01-16
