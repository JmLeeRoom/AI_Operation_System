from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import os
import uuid
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정 (프론트엔드 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 코드가 저장될 디렉토리
STORAGE_DIR = "stored_scripts"
if not os.path.exists(STORAGE_DIR):
    os.makedirs(STORAGE_DIR)

class CodeRequest(BaseModel):
    code: str

@app.post("/api/execute")
async def execute_python_code(request: CodeRequest):
    try:
        # 1. 파일명 생성 (타임스탬프 + UUID)
        file_id = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
        file_path = os.path.join(STORAGE_DIR, f"{file_id}.py")

        # 2. 코드 로컬 저장
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(request.code)

        # 3. 코드 실행 (Subprocess)
        # 보안 주의: 실제 운영 환경에서는 Docker 컨테이너 내 실행 권장
        result = subprocess.run(
            ["python3", file_path],
            capture_output=True,
            text=True,
            timeout=30  # 무한 루프 방지
        )

        # 4. 실행 흐름 로그 출력 (서버 터미널 확인용)
        print(f"[INFO] Executed file: {file_path}")
        print(f"[INFO] Status: {'Success' if result.returncode == 0 else 'Error'}")

        return {
            "file_name": f"{file_id}.py",
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode
        }

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Execution Timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)