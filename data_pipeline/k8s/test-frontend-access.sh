#!/bin/bash

echo "=== 프론트엔드 접속 테스트 ==="
echo ""

# 1. 포트 포워딩 프로세스 확인
echo "1. 포트 포워딩 프로세스 확인:"
PF_PROCESSES=$(ps aux | grep "kubectl port-forward.*frontend" | grep -v grep)
if [ -z "$PF_PROCESSES" ]; then
    echo "   ❌ 포트 포워딩이 실행되지 않았습니다!"
    echo "   다음 명령어로 시작하세요:"
    echo "   kubectl port-forward -n data-pipeline service/frontend-service 8080:80 --address=0.0.0.0"
    exit 1
else
    echo "   ✅ 포트 포워딩 실행 중:"
    echo "$PF_PROCESSES" | sed 's/^/   /'
fi
echo ""

# 2. 포트 리스닝 확인
echo "2. 포트 8080 리스닝 확인:"
if command -v netstat &> /dev/null; then
    PORT_STATUS=$(netstat -tlnp 2>/dev/null | grep 8080)
elif command -v ss &> /dev/null; then
    PORT_STATUS=$(ss -tlnp 2>/dev/null | grep 8080)
fi

if [ -z "$PORT_STATUS" ]; then
    echo "   ❌ 포트 8080이 리스닝되지 않습니다!"
    exit 1
else
    echo "   ✅ 포트 8080 리스닝 중:"
    echo "$PORT_STATUS" | sed 's/^/   /'
fi
echo ""

# 3. HTTP 연결 테스트
echo "3. HTTP 연결 테스트:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080 2>&1)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "   ✅ HTTP 연결 성공 (Status: $HTTP_STATUS)"
else
    echo "   ❌ HTTP 연결 실패 (Status: $HTTP_STATUS)"
    exit 1
fi
echo ""

# 4. HTML 응답 확인
echo "4. HTML 응답 확인:"
HTML_TITLE=$(curl -s http://127.0.0.1:8080 | grep -o '<title>.*</title>' | head -1)
if [ -n "$HTML_TITLE" ]; then
    echo "   ✅ HTML 응답 정상: $HTML_TITLE"
else
    echo "   ❌ HTML 응답 없음"
    exit 1
fi
echo ""

# 5. 브라우저 접속 안내
echo "=== 브라우저 접속 안내 ==="
echo ""
echo "포트 포워딩이 정상적으로 실행 중입니다."
echo ""
echo "브라우저에서 다음 주소로 접속하세요:"
echo "  - http://127.0.0.1:8080 (권장)"
echo "  - http://localhost:8080"
echo ""
echo "만약 여전히 연결이 안 된다면:"
echo "  1. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)"
echo "  2. 시크릿 모드에서 접속 시도"
echo "  3. 다른 브라우저에서 시도"
echo "  4. 방화벽 설정 확인"
echo ""
