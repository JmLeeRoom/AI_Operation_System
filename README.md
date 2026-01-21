# 1. 플랫폼 기반 구축

## 1.1 Harvester란?

- Kubernetes 위에 가상화(VM) 및 분산 스토리지를 붙여서, 베어메탈을 HCI처럼 쓰게 해주는 플랫폼
- vSphere/클러스터처럼 템플릿 또는 클론을 포함하여 VM을 만들고, 라이브 마이그레이션하고, 스토리지까지 같이 관리하는 것이 목표

## 1.2 Harvester 핵심 기능

- **KubeVirt**
    - Kubernetes 안에서 VM을 “K8s 리소스”처럼 다루는 가상화 레이어
- **Longhorn**
    - Kubernetes용 분산 블록 스토리지(로컬 디스크를 모아서 분산 스토리지처럼)
- **Elemental (SLE Micro 기반 불변 OS)**
    - 노드 OS 유지보수를 줄이려는 “어플라이언스형” 운영 방식
- **Rancher와 통합**해서 VM과 K8s 클러스터를 한 화면에서 같이 관리

## 1.3 하드웨어 및 네트워크 요구사항

- CPU: **x86_64**, HW 가상화 필수, 테스트 8코어 / 프로덕션 16코어+
- RAM: 테스트 32GB / 프로덕션 64GB+
- 디스크 용량: 테스트 250GB(멀티디스크면 180GB) / 프로덕션 500GB+
- 디스크 성능: **디스크당 랜덤 5,000+ IOPS(SSD/NVMe 권장)**, 특히 **첫 3노드(관리 노드)는 etcd 때문에 빨라야 함**
- NIC: 테스트 1GbE / 프로덕션 10GbE
- 스위치: **VLAN 쓰려면 트렁킹(Tagged) 필요**

## 1.4 설치

1. ISO 설치
    - https://github.com/harvester/harvester/releases
    
    ![image.png](attachment:94384686-0937-4ab6-aa81-e9aa5c84db6a:image.png)
     
3. **하드웨어 체크**(요구사항 미달이면 경고/중단 가능)
    
    ![image.png](attachment:79931907-504a-4935-a87a-e91af08d6095:image.png)
    
4. 설치 모드 선택
    - Create new cluster / Join existing cluster / binaries only
    
    ![image.png](attachment:4720f30b-0d8e-4780-b0b9-dc9a9e2ad16c:image.png)
    
5. (Join일 때) **노드 Role 선택**
    - default / management / worker / witness
    
    ![image.png](attachment:5777e9a4-ba30-4f79-9207-fc8e60e704d4:image.png)
    
6. SSH 접속용 `rancher` 유저 비밀번호 설정
    
    ![image.png](attachment:48a97f74-bc73-4853-95ef-53d0c9199627:image.png)
    
7. **설치 디스크 / 데이터 디스크 선택**
    - 가능하면 **OS용 디스크 + VM 데이터용 디스크 분리** 권장
    - 단일 디스크면 persistent partition 최소 150GiB
    
    ![image.png](attachment:dd725147-886b-4d74-b675-291e536edbe5:image.png)
    
8. **관리망 NIC 설정**
    - 기본으로 **bonded NIC `mgmt-bo`** 생성
    - DHCP 또는 Static 가능
        - 스위치는 **trunk로 구성**하라고 문서에서 강하게 말함(Tagged VLAN 트래픽)
        - 그리고 **노드 IP는 클러스터 생명주기 동안 바꾸면 안 된다**(DHCP면 “항상 같은 IP” 나오게 고정)
    
    ![image.png](attachment:93c0cbb2-fe0c-4b45-b59e-6e99fca57e25:image.png)
    
9. (선택) Pod/Service CIDR, DNS 서버, NTP 등
    
    ![image.png](attachment:eb87c6dd-2fb3-4391-a9b1-2d170df6f552:image.png)
    
10. **VIP 설정**
    - VIP는 Harvester UI 접속 주소이자 노드 Join 기준점
    - VIP 모드는 **static / dhcp**가 있고 dhcp면 `vip_hw_addr` 요구
    
    ![image.png](attachment:b5f5c75d-d9e9-4eb5-8465-c99ad2e7bb0e:image.png)
    
11. **Cluster token 설정**(추가 노드 Join에 사용)
    
    ![image.png](attachment:219d20d6-f878-459c-b1d1-404e5364c0de:image.png)
    
12. 설치 완료 후 재부팅 → 콘솔에 관리 URL 뜸(기본이 `https://<VIP>`)
    
    ![image.png](attachment:9404d652-9e16-4b5a-bd55-0c646d46204e:image.png)
    
13. 첫 로그인 시 `admin` 비밀번호 설정
    
    ![image.png](attachment:a0e5dbb8-ab51-497b-9f76-d9c715d38200:image.png)
    

## 1.5 Harvester UI 네이게이션 페이지

1. DashBoard
    - 클러스터/VM 상태 요약
    
    ![image.png](attachment:22169863-8c66-4678-aa94-84295645e1e9:image.png)
    
2. Host
    - 물리 노드(서버) 관리
    
    ![image.png](attachment:7cc27c6c-b31c-49dd-b8b3-df90d0e4eaab:image.png)
    
3. Virtual Machines
    - VM 라이프사이클 관리
    
    ![image.png](attachment:cdeed7b6-c96f-4e7c-909a-cb658a7c05c7:image.png)
    
4. Volumes
    - VM 디스크(PVC/볼륨) 관리
    
    ![image.png](attachment:d138b344-0bb1-4e01-a952-6e0a41abd2a8:image.png)
    
5. Images
    - VM 이미지(ISO/클라우드 이미지 등) 관리
    
    ![image.png](attachment:f2feb472-b161-42ed-9606-36546142e8f9:image.png)
    
6. Namespaces
    - 리소스 격리(테넌시 단위)
7. Networks
    - VM/클러스터 네트워킹
    
    ![image.png](attachment:4312ec03-f9aa-439e-bec2-c261131323eb:image.png)
    
8. Backup & Snapshot
    - 백업/스냅샷 운영
    
    ![image.png](attachment:34ada0f4-af4e-46cd-b38f-de16cceb2165:image.png)
    
9. Monitoring & Logging
    - 관측(메트릭/로그)
    
    ![image.png](attachment:a428c0ae-99dd-4be6-b5ad-9c9194b0b2c4:image.png)
    
10. Advanced
    - 클러스터 전역 설정/애드온
    
    ![image.png](attachment:acb0a173-62d5-4b74-8ae9-656298fc28a9:image.png)
    

# 2. 데이터 카탈로그

## 2.1 데이터 카탈로그란?

- 조직이 보유한 데이터 자산(테이블/파일/스트림 등)의 ‘메타데이터’를 모아, 검색·이해·신뢰·거버넌스를 가능하게 하는 시스템

## 2.2 데이터 카탈로그 주요 기능

- **데이터 인벤토리(Inventory)**
    - 어떤 시스템에 어떤 데이터가 있는지(카탈로그/DB/스키마/테이블/컬럼)
    - 데이터 위치(예: S3 경로, DB 커넥션, 플랫폼 정보)
- **데이터 설명서(Documentation)**
    - 컬럼 의미, 단위, 예시, 소스, 갱신 주기
    - Owner(책임자), 담당 팀, SLA/운영 정보
- **검색/탐색(Discovery)**
    - 키워드 검색, 필터(도메인/태그/오너/플랫폼), 추천(인기/최근)
- **신뢰 신호(Trust Signals)**
    - 최신 업데이트 시간, 품질 지표, 사용량, 라인리지(어디서 왔고 어디로 쓰이는지)
- **거버넌스/정책(Policy & Governance)**
    - 태그(PII 등) 기반 통제, 접근 권한, 감사(누가 무엇을 봤는지)

## 2.3 엔터프라이즈 기업에서 데이터 카탈로그 프로젝트의 중요성

- 데이터 규모가 커지면 데이터 찾기 어려움
    - 엔터프라이즈는 데이터 소스가 많고 팀도 많아서, 데이터가 존재해도 발견이 안 되면 재활용이 불가능
    - 결과: **중복 테이블/중복 파이프라인/중복 비용**이 폭발
- 데이터 신뢰 문제가 곧바로 “비즈니스 리스크
    - 대기업은 잘못된 지표 하나가 의사결정/보고/매출에 영향을 줌
    - 카탈로그의 “라인리지/최신성/품질/오너”는 **사고 예방 장치**
- 오너십(책임) 없으면 운영이 힘듬
- 장애나 데이터 이상이 생겼을 때 “누가 책임지고 고치는지”가 없으면 대응이 늦어짐.
- 카탈로그는 **Owner/담당팀/연락 경로**를 공식화한다.
- 컴플라이언스(개인정보/보안/감사) 때문에 필수
    - 대기업은 개인정보/민감정보를 잘못 다루면 **법적 리스크 + 감사 리스크**가 바로 발생.
    - 카탈로그는 보통 PII 태깅, 컬럼 단위 권한, 접근 로그/감사의 기준
- 셀프서비스(Self-Service)로 생산성에 기여
    - 카탈로그는 질문을 줄이고, **데이터팀 병목을 제거**
- 조직이 커질수록 표준 용어 정의가 필요
    - 엔터프라이즈에서는 같은 단어가 팀마다 다른 의미로 쓰이는 일이 흔함
    - 카탈로그는 용어집/도메인/태그를 통해 **정의(semantic)를 표준화**
- 멀티 플랫폼 환경 통합이 필요
    - 현실은 한 플랫폼으로 통일이 되지 않음
    - DB, DWH, Lake, 스트리밍, SaaS등 혼재
    - 카탈로그는 이걸 하나의 검색 및 탐색 경험 통합
- 데이터 메시/데이터 제품 조직으로 가려면 기반이 필요
    - 요즘 엔터프라이즈는 “데이터를 제품처럼” 운영
    - 그 제품의 설명서/품질/SLA/오너를 담는 곳이 바로 카탈로그

## 2.4 데이터 카탈로그 시스템

### 2.4.1 시스템 구성도

![image.png](attachment:d0c2d8c7-7a69-4669-a9a9-fcc3a24be7ea:image.png)

### 2.4.2 데이터 DB 구조

![image.png](attachment:13929f8d-9367-46dd-8a9e-fe1f1cb4f24d:image.png)

### 2.4.3 카탈로그 프론트엔드

1. 대시보드 (Dashboard)
    - 애플리케이션의 홈 화면으로, 사용자가 시스템의 전체적인 상태를 한눈에 파악하고 주요 작업으로 빠르게 이동할 수 있는 **허브 역할**
    - **주요 기능**
        - 환영 메시지
        - 전체 데이터 요약 통계
        - 현재 트렌딩 중인 테이블 목록
        - 즐겨찾기(Quick Access)
        - 최근 활동 피드
2. 카탈로그 (Catalogs)
    - 연결된 다양한 데이터 소스(Snowflake, BigQuery, PostgreSQL 등)를 **최상위 수준에서 관리하고 탐색**하는 페이지
    - **주요 기능**
        - 카탈로그 목록을 그리드나 리스트 형태로 조회
        - 플랫폼별로 필터링
        - 각 카탈로그에 포함된 테이블 수, 현재 상태, 소유자 정보 등 확인 가능
3. 테이블 목록 (Tables)
    - 시스템 내에 존재하는 **모든 테이블을 리스트 형태로 브라우징**하는 페이지
    - **주요 기능**
        - 테이블 검색 및 필터링 기능을 제공
        - 행을 확장하여 상세 정보를 미리 보거나, 데이터 품질 점수(Quality Score), 태그, 소유자 정보를 한눈에 비교 가능
4. 테이블 상세 (Table Detail)
    - 특정 테이블에 대한 **모든 메타데이터와 컨텍스트를 심층적으로 제공하는** 페이지
    - **주요 기능:**
        - **Columns**
            - 컬럼명, 데이터 타입, Null 허용 여부, PK 여부, 샘플 데이터 확인.
        - **Lineage**
            - 데이터가 어디서 오고(Upstream) 어디로 가는지(Downstream) 시각화.
        - **Queries**
            - 해당 테이블을 대상으로 실행된 최근 쿼리 이력 공유.
        - **Documentation**
            - 테이블 사용 가이드 및 데이터 보존 정책 등 문서화.
        - **Discussion**
            - 데이터와 관련된 사용자 간의 질의응답 및 토론.
5. 검색 (Search)
    - 사용자가 원하는 데이터를 **키워드 기반으로 빠르게 찾아낼 수 있도록 돕는 도구**
    - **주요 기능**
        - 전체 텍스트 검색을 지원하며 타입, 플랫폼, 태그별 상세 필터 제공
        - 검색 결과에서 키워드 하이라이팅 기능과 향후 AI 기반 검색을 위한 UI 레이아웃이 포함

### 2.4.4 카탈로그 백엔드

- **기능**
    - **인증/권한**
        - 로그인·토큰·리프레시
        - 사용자/팀/역할 관리
        - 자산 단위 권한
        - API 키 발급/폐기
        - 감사 로그
    - **카탈로그/테이블**
        - 카탈로그 CRUD 및 필터
        - 테이블/컬럼 메타데이터 조회·수정
        - 상세 페이지용 품질/통계
        - 스키마 변경 이력
        - 소스 동기화 상태
    - **검색/발견**
        - 테이블·컬럼·태그·용어 통합 검색
        - 타입/플랫폼/태그/품질 필터
        - 정렬/하이라이트, 자동완성
        - 최근/즐겨찾기 검색
    - **라인리지/임팩트**
        - 노드·엣지 저장
        - upstream/downstream 탐색
        - 영향 분석 리포트, 변경 이벤트/심각도 기록
        - 그래프 export
    - **거버넌스**
        - 태그 카테고리/태그 CRUD
        - 태그-자산 매핑/정책 검증
        - 소유자/팀 디렉토리와 할당
        - 용어사전 CRUD/승인
        - 용어-테이블 링크
    - **대시보드/설정**
        - 요약 지표·트렌딩·활동 피드
        - 알림 채널/규칙 설정
        - 데이터 소스 연결/헬스체크/스케줄
        - 프로필·테마 설정
- 라이브러리
    - **API/기본**
        - github.com/go-chi/chi/v5 — 경량 라우팅/미들웨어
        - github.com/caarlos0/env/v11 — 환경변수 설정
        - github.com/go-playground/validator/v10 — 요청 검증
        - go.uber.org/zap — 구조화 로깅
        - github.com/jackc/pgx/v5 — Postgres 드라이버
        - github.com/pressly/goose/v3 — 마이그레이션
    - **인증/권한**
        - golang.org/x/crypto/bcrypt — 비밀번호 해시
        - github.com/golang-jwt/jwt/v5 — JWT 발급/검증
        - github.com/casbin/casbin/v2 — RBAC/ABAC 정책
        - golang.org/x/oauth2 — SSO 연동
    - **검색/라인리지/비동기**
        - github.com/elastic/go-elasticsearch/v8 — 전체 텍스트/랭킹 검색
        - github.com/neo4j/neo4j-go-driver/v5 — 라인리지 그래프 질의
        - github.com/hibiken/asynq — 수집·집계 비동기 작업
        - github.com/robfig/cron/v3 — 주기 동기화
    - **캐시/관측**
        - github.com/redis/go-redis/v9 — 캐시/세션/큐 백엔드
        - go.opentelemetry.io/otel — 분산 추적
        - github.com/prometheus/client_golang — 메트릭
        - github.com/go-chi/cors — CORS 제어

### 2.4.5 프로젝트 업무 구조

- 그림 구조

![image.png](attachment:372bd07a-38e9-44bb-8f43-3326597f5fce:image.png)

- 기능 단위로 분류
    1. 대시보드 (Dashboard)
        - **대시보드/설정(DASH)**
            - 요약 지표
            - 트렌딩
            - 즐겨찾기
            - 활동 피드
            - 알림 요약
        - **인증/권한(AUTH)**
            - 로그인 상태/유저 정보
            - 권한 기반 위젯 노출
    2. 카탈로그 (Catalogs)
        - **카탈로그/테이블**
            - 카탈로그 목록 및 상태
            - 테이블 수 및 소스 동기화 상태
        - **거버넌스(GOV)**
            - 오너/팀 정보
            - 태그 요약(카탈로그 단위 분류)
        - **인증/권한(AUTH)**
            - 권한 없는 카탈로그 숨김
            - 읽기/관리 권한에 따른 UI 제어
    3. 테이블 목록 (Tables)
        - **카탈로그/테이블**
            - 전체 테이블 브라우징
            - 메타데이터/품질 요약 비교
        - **검색/발견(SEARCH)**
            - 검색/필터/정렬/하이라이트 기반 리스트 탐색
        - **거버넌스(GOV)**
            - 태그/오너/도메인 정보 표시 및 비교
        - **인증/권한(AUTH)**
            - 테이블별 접근 수준(읽기/수정/관리)에 따른 액션 제한
    4. 테이블 상세 (Table Detail)
        - **카탈로그/테이블(CAT)**
            - 컬럼/스키마
            - 품질/통계
            - 변경 이력
            - 동기화 상태
        - **라인리지/임팩트**
            - upstream/downstream 시각화
            - 영향 분석
            - 그래프 export
        - **거버넌스(GOV)**
            - 태그/오너/용어사전/문서/토론(협업) 요소
        - **인증/권한(AUTH)**
            - 수정 가능 여부(태그/오너/속성)
            - 변경에 대한 감사 로그
    5. 검색 (Search)
        - **검색/발견(SEARCH)**
            - 통합 검색(테이블/컬럼/태그/용어)
            - 자동완성
            - 하이라이트
            - 필터
        - **카탈로그/테이블**
            - 검색 결과 클릭 시 상세/메타정보 연결
        - **거버넌스(GOV)**
            - 태그/용어 기반 탐색 강화(데이터 표준/정의 연결)
        - **인증/권한(AUTH)**
            - 권한 없는 결과 제외
            - 정책 기반 결과 제어

# 3. 인증인가

## 3.1 인증인가란?

- 정책을 만들고(Role/Policy), 평가하고(OPA), 외부 시스템(MinIO/AWS)에 배포/동기화까지 하는 Authorization 플랫폼

## 3.2 인증 인가 주요 기능

- **IdP(Identity Provider)**
    - (토큰 발급/교환/인트로스펙션)
    - (유저/그룹 관리 조회)
- **API 서버(PEP 성격)**
    - Fiber 라우팅/핸들러 및 `tokenauth` 미들웨어로 요청 진입점에서 토큰 기반 접근 제어
- **권한 결정(PDP)**
    - OPA(Rego)로 권한 평가(verify/dry-run)
- **정책/역할 관리(PAP)**
    - User/Group/Department/Role/Policy CRUD와 관계(attach/detach)
- **실제 리소스에 반영**
    - MinIO의 canned policy/LDAP policy attachment, AWS 정책 변환

## 3.3 엔터프라이즈 기업에서 인증인가 프로젝트의 중요성

### 3.3.1 보안 리스크/사고 예방

- 가장 큰 비용 절감
- 권한이 여기저기 흩어져 있으면 **과다 권한(Privilege Creep)** 문제 발생
- 예시) “퇴사자 권한 미회수”, “테스트 계정이 운영 접근”, “특정 팀만 봐야 하는 테이블이 전체 공개”
- 중앙화하면 **최소권한(Least Privilege)**, **권한 검토(Access Review)**, **즉시 회수(Deprovisioning)** 가능

### 3.3.2 감사/규정 준수(Compliance) 대응

- 엔터프라이즈는 내부/외부 감사가 자주 일어남
    - 데이터에 접근 가능한 사용자
    - 언제, 누가, 어떤 정책 허용
    - 권한 변경 승인 주체
- 인증/인가가 중앙화
    - **감사 로그(Policy decision log)** 를 한 곳에서 볼 수 있음
    - 정책 변경 히스토리/승인 워크플로우도 붙이기 용이

### 3.3.3 조직 구조 변화에 강해짐 (부서/그룹/역할 기반)

- 엔터프라이즈는 **조직개편/인사이동** 자주 일어남
    - 사용자 단위 권한 부여(User-based)는 한계가 분명함
- 역할(Role), 그룹(Group), 부서(Department)를 기준 설계
    - 이동/겸직/프로젝트 투입에도 **권한이 자동으로 맞춰짐**.

### 3.3.4 멀티 시스템/멀티 클라우드 환경을 연결하는 “허브”

- 현실 시스템은 다수
    - 사내 포털, 데이터 카탈로그, DWH, S3/MinIO, API Gateway, K8s, BI 도구 등 각각 따로 권한 관리하면 운영 지옥
- 중앙 AuthZ
    - **정책을 한 곳에서 정의**
    - 각 시스템에 **정책 배포/동기화(예: S3/MinIO 정책, AWS IAM 정책)**  가능

---

### 3.3.5 제품 확장 속도(개발 생산성) 향상

- 서비스가 늘어남
    - “권한 체크” 로직이 중복
    - 팀마다 토큰 검증 방식이 다름
    - 권한 모델이 제각각
    - 신규 서비스 출시 때마다 보안 리뷰/수정 반복
- 공통 인가 플랫폼
    - 신규 서비스는 **토큰 + 정책 조회/평가 API**만 붙이면 이용 가능
    - “권한 기능”을 제품마다 다시 만들 필요가 없어짐

---

### 3.3.6 운영 관점: 장애 분석이 빨라짐 (403/401 원인 분리)

- 엔터프라이즈 운영
    - 문제 원인 추적이 핵심 개념
- 중앙 시스템
    - 401(인증 실패) vs 403(인가 거부) 분리
    - 어떤 정책 때문에 거부됐는지 근거 제공(OPA reason 등)
    - 고객/내부 CS 대응이 빨라짐

---

### 3.3.7 데이터 거버넌스/Zero Trust로 가는 기반

- 트렌드
    - 네트워크 안이면 안전이 아닌 요청마다 검증 (Zero Trust)
- 데이터/AI 조직
    - 테이블/컬럼 단위 권한
    - 마스킹/행 수준 필터링
    - 워크로드(파이프라인/잡) 단위 권한

## 3.4 인증 인가 시스템

### 3.4.1 시스템 구성도

![image.png](attachment:60f4319b-9ed3-468a-8594-76f09cc547ad:image.png)

### 3.4.2 데이터 DB 구조

![image.png](attachment:ff103909-e147-452a-bd63-ba76051e49e0:image.png)

### 3.4.3 인증인가 프론트엔드

1. 로그인
    - SSO 버튼 (Keycloak, LDAP)
    - 패스워드 토글
    - 보안 배지
2. 대시보드
    - 통계 카드
    - 차트
    - 활동 피드
    - 시스템 상태
    - 빠른 작업
3. 사용자 관리
    - 테이블
    - 필터
    - 상세 패널
    - 모달
    - 벌크 액션
4. 그룹 관리
    - 카드 그리드/리스트 뷰 전환
    - 멤버 아바타 스택
5. 부서 관리
    - 조직 트리 뷰
    - 상세 패널
    - 멤버 리스트
    - 역할 할당
6. 역할 관리
    - 역할 카드
    - 정책 칩
    - 필터 탭
7. 정책 관리
    - 정책 테이블
    - JSON 미리보기
    - Dry Run 테스트 UI
8. 감사 로그
    - 통계 바
    - 실시간 인디케이터
    - 로그 엔트리
    - 상세 패널

### 3.4.4 인증인가 백엔드

- 기능
    1. 로그인
        - SSO 연동: Keycloak(OIDC), LDAP/AD 인증 처리
        - 폼 로그인 검증(로컬 계정 필요 시), 토큰 발급/갱신/로그아웃
        - 사용자 프로비저닝 및 속성 동기화(부서/그룹/역할 매핑)
        - 보안 이벤트 로깅(성공/실패/잠금), 정책 기반 접근 제한
    2. 대시보드
        - 통계 집계 API: 사용자/역할/정책/요청 수 등 KPI 제공
        - 차트 데이터 API: 기간별 접근 요청·결정 추이
        - 활동 피드 API: 최근 변경 이력(사용자/역할/정책)
        - 시스템 상태 API: OPA/Keycloak/DB/MinIO/Policy Sync 헬스체크
        - 빠른 작업 연동: 사용자/역할/정책 생성 API 연결
    3. 사용자 관리
        - 사용자 목록 조회: 검색/필터/정렬/페이지네이션
        - 사용자 상세 조회/수정: 상태, 마지막 로그인, 메타정보
        - 역할/그룹/부서 할당 및 해제
        - 벌크 액션: 대량 활성/비활성, 역할 부여, 삭제
        - CSV 가져오기 처리: 업로드 검증, 중복 처리, 결과 리포트
    4. 그룹 관리
        - 그룹 CRUD 및 목록 조회(멤버수/역할수 집계 포함)
        - 그룹 멤버십 관리: 추가/삭제/일괄 편집
        - 그룹별 역할 할당 및 해제
    5. 부서 관리
        - 조직 트리 CRUD: 계층 구조 조회/이동/정렬
        - 부서 상세 데이터: 구성원 리스트, 통계, 경로 정보
        - 부서별 역할 할당/해제 및 적용 현황 제공
    6. 역할 관리
        - 역할 CRUD: 시스템/커스텀 구분, 활성/비활성 상태
        - 역할-정책 매핑 관리
        - 역할 사용 현황: 사용자/그룹 카운트 집계
        - 필터 탭 지원: 전체/시스템/커스텀/활성/비활성
    7. 정책 관리
        - 정책 CRUD: 유형, 리소스, 액션, 상태 관리
        - 정책 JSON 저장/검증(OPA/Rego 또는 정책 스키마)
        - Dry Run 평가 API: 사용자·액션·리소스 입력 → 허용/거부 결과
        - 정책-역할 연결 조회 및 집계
        - 필터/검색/페이지네이션 및 정책 내보내기
    8. 감사 로그
        - 로그 수집/저장: 인증, 인가 결정, 변경 이벤트
        - 조회 API: 기간/사용자/결과/리소스 기반 필터
        - 실시간 스트림(SSE/WS) 지원
        - 상세 조회: 원본 JSON, 컨텍스트(정책/주체/리소스)
        - 통계 바 집계 및 로그 내보내기
- 라이브러리
    1. **HTTP/API**
        - github.com/go-chi/chi/v5 — 라우팅
        - github.com/go-chi/cors — CORS
        - github.com/go-chi/chi/v5/middleware — 공통 미들웨어
    2. **인증/권한**
        - github.com/coreos/go-oidc/v3/oidc — OIDC
        - golang.org/x/oauth2 — OAuth2
        - github.com/golang-jwt/jwt/v5 — JWT
        - github.com/go-ldap/ldap/v3 — LDAP
        - golang.org/x/crypto/bcrypt — 비밀번호 해시
    3. **정책 엔진**
        - github.com/open-policy-agent/opa/rego — OPA Rego 평가
        - net/http — OPA 외부 호출
    4. **데이터**
        - gorm.io/gorm — ORM
        - gorm.io/driver/postgres — Postgres 드라이버
        - github.com/golang-migrate/migrate/v4 — 마이그레이션
        - github.com/google/uuid — UUID
    5. **검증/설정/로깅**
        - github.com/go-playground/validator/v10 — 요청 검증
        - github.com/spf13/viper — 설정 관리
        - go.uber.org/zap — 구조화 로깅
    6. **감사/실시간/관측**
        - github.com/r3labs/sse/v2 — SSE
        - github.com/prometheus/client_golang/prometheus — 메트릭
        - go.opentelemetry.io/otel — 분산 추적

### 3.4.5 프로젝트 업무 구조

- 그림 구조

![image.png](attachment:fc145647-569d-4162-b745-12716bb1ccec:image.png)

- 기능 단위로 분류
    1. 로그인/세션 (AuthN Session)
        - **인증/세션(AUTHN)**
            - SSO 로그인: Keycloak(OIDC) 연동
            - LDAP/AD 인증(옵션) 및 사용자 조회/검증
            - 토큰 발급/갱신/로그아웃(Access/Refresh)
            - 토큰 인트로스펙션/유효성 검증
            - 로그인 성공/실패/잠금 등 보안 이벤트 로깅
        - **프로비저닝/동기화(PROV)**
            - 최초 로그인 시 사용자 프로비저닝(계정 생성/업데이트)
            - 사용자 속성 동기화(부서/그룹/역할 매핑)
            - 외부 IdP 그룹/클레임 → 내부 모델 매핑 규칙 관리
        - **운영/보안(SECOPS)**
            - 비정상 로그인 탐지(횟수/속도 제한 정책 적용 포인트)
            - 세션 만료/강제 로그아웃(퇴사/권한 회수 시나리오)
    2. 인가 진입점(PEP) / 요청 게이트 (API Gateway Layer)
        - **API 게이트(PEP)**
            - Fiber 라우팅 및 공통 미들웨어 체인 구성
            - `tokenauth` 미들웨어: 요청 진입 시 토큰 기반 접근 제어
            - 401(인증 실패) / 403(인가 거부) 응답 규격 분리
        - **클레임/컨텍스트(CTX)**
            - JWT Claims 추출(Workbench Claims)
            - subject/user/group/department/role 컨텍스트 구성
            - Request DTO ↔ Internal DTO 매핑(Validation 포함)
        - **에러 표준화(ERROR)**
            - ProblemDetail 기반 표준 에러 응답 빌더
            - 정책 거부 시 reason/trace-id 등 근거 포함
    3. 사용자 관리 (Users)
        - **사용자(USR)**
            - 사용자 목록 조회(검색/필터/정렬/페이지네이션)
            - 사용자 상세 조회/수정(상태, 메타정보, 마지막 로그인 등)
            - 사용자 활성/비활성, 삭제(정책에 따른 제한)
        - **벌크/가져오기(BULK)**
            - 벌크 액션(대량 활성/비활성, 역할 부여/해제)
            - CSV 가져오기: 업로드 검증/중복 처리/결과 리포트
        - **관계 관리(REL)**
            - 사용자 ↔ 그룹/부서/역할 할당 및 해제
    4. 그룹 관리 (Groups)
        - **그룹(GRP)**
            - 그룹 CRUD 및 목록 조회(멤버수/역할수 집계 포함)
            - 그룹별 역할 할당/해제
        - **멤버십(MEMBER)**
            - 그룹 멤버 추가/삭제/일괄 편집
            - 외부(IdP) 그룹과 내부 그룹 매핑(동기화 사용 시)
    5. 부서/조직 트리 (Departments / Org)
        - **조직 구조(ORG)**
            - 부서 트리 CRUD(계층 조회/이동/정렬)
            - 부서 경로/상위-하위 관계 관리
        - **부서 기반 권한(DEP-AUTHZ)**
            - 부서별 역할 할당/해제
            - 부서 구성원 리스트/통계/적용 현황 제공
    6. 역할 관리 (Roles)
        - **역할(ROLE)**
            - 역할 CRUD(시스템/커스텀 구분)
            - 활성/비활성 상태 관리
            - all_users(전체 사용자 자동 포함) 같은 특수 플래그 정책
        - **역할 적용 대상(SCOPE)**
            - 역할 ↔ 사용자/그룹/부서 매핑(attach/detach)
            - 역할 사용 현황 집계(사용자/그룹 카운트)
        - **역할-정책 연결(ROLE-POLICY)**
            - 역할 ↔ 정책 매핑 관리(추가/삭제/일괄)
    7. 정책 관리 (Policies / PAP)
        - **정책(POLICY)**
            - 정책 CRUD(유형, 리소스, 액션, 상태)
            - `policy_json` 저장/스키마 검증(OPA/Rego 또는 정책 스키마)
            - 정책 활성/비활성 및 버전/변경 이력 기반 운영
        - **정책 테스트(TEST)**
            - Dry Run 평가 API: 사용자·액션·리소스 입력 → 허용/거부
            - 정책-역할 연결 조회/집계
        - **내보내기/배포 준비(EXPORT)**
            - 정책 내보내기(외부 시스템 적용 포맷 변환의 입력)
    8. 권한 결정(PDP) / OPA 평가 (Policy Decision)
        - **OPA 평가(PDP)**
            - OPA(Rego) 기반 verify API(실제 요청 인가 판단)
            - Dry Run API(운영/관리자 테스트)
        - **Rego 실행(ENGINE)**
            - RegoEval/ExecuteRegoEval 어댑터 레이어
            - Rego 모듈 관리(internal/resources rego files)
        - **결정 근거(REASON)**
            - allow/deny 결과 + 근거(reason) 반환
            - 403 발생 시 “어떤 정책/규칙 때문에 거부됐는지” 추적 가능하게 설계
    9. 외부 시스템 반영(Policy Sync)
        - **MinIO 반영(MINIO)**
            - canned policy 생성/업데이트
            - LDAP policy attachment(조직/그룹 기반 연결)
        - **AWS 반영(AWS)**
            - 정책 JSON → AWS IAM 정책 변환
            - 배포/동기화(권한 모델 차이 매핑 규칙 포함)
        - **동기화 트리거(SYNC)**
            - 정책 변경 이벤트 → 배포/동기화 Job/Trigger
            - 동기화 성공/실패 상태 관리 및 재시도 전략
    10. 감사 로그 / 운영 관측 (Audit & Observability)
        - **감사 로그(AUDIT)**
            - 인증 이벤트(로그인/실패/잠금) 로그 수집/저장
            - 인가 결정 로그(Policy decision log) 저장
            - 변경 이벤트(사용자/역할/정책/매핑 attach/detach) 저장
        - **실시간 스트림(REALTIME)**
            - SSE/WS 기반 실시간 로그 스트림 제공
        - **관측성(OBS)**
            - Zap 구조화 로깅 + 모드 로거(환경별 레벨/포맷)
            - OpenTelemetry 트레이싱(InitTracer)
            - Prometheus 메트릭(요청 수/지연/결정 결과 비율 등)
        - **장애 분석(OPS)**
            - 401 vs 403 원인 분리
            - OPA reason/trace-id 기반 빠른 원인 추적

# 4. AI-Operations

- 공통 플랫폼 모듈과 문제 해결을 중심으로 각각 도메인을 만든 플랫폼 프로그램 UI

## 4.1 AI-Operations 란?

- 파이프라인 중심 MLOps 플랫폼
- 모델의 라이프사이클을 운영 관리하는 제공
- 플랫폼 공통 운용 모듈과 멀티 도메인 운영 모듈을 제공

### 4.1.1 AIOps의 라이프사이클

- 데이터 - 학습 - 평가 - 배포 - 모니터링

## 4.2 AI-Operations 주요 기능

### 4.2.1 공통 플랫폼

- 파이프라인 및 DAG 관리
- 실행 모니터링
- 데이터 관리
- 모델 수명 주기
- 운영 모니터링
- 리소스 및 거버넌스

### 4.2.2 도메인

- ComputerVision
    - 데이터
    - 라벨링
    - 학습
    - 평가
    - 모델 Export
- LLM
    - 데이터 파이프라인
    - 학습
    - 템플릿
    - 평가 및 안정성
    - RAG
    - Agent
    - 배포
- Audio
    - ASR/TTS/VC/뮤직별 데이터 학습
    - 평가 및 안정성
    - 배포
- Multimodal
    - 데이터 접합 및 정렬
    - 학습 및 평가
    - Serving 및 Agent
- TimeSeries
    - 피처 파이프라인
    - 백테스트
    - 이상 탐지 임계값 및 트리아지
    - TimeSeries 전용 배포 및 모니터링

## 4.3 엔터프라이즈 기업에서 AI-Operations 프로젝트의 중요성

- AI-Operations은 모델을 만드는 것이 아닌 기업 시스템 처럼 안전하게 운영하기 위한 기반

### 4.3.1 비용 절감과 자원 최적화

- GPU 및 인프라는 비용
- 학습 및 서빙 비용 변동이 큼
- 탐별로 제각각 운영하면 GPU 낭비가 심함
- AI-Operations 사용의 이점
    - 실행 비용 및 시간 그리고 리소스 (GPU, CPU 및 메모리)등을 Run 단위로 추적
    - 우선순위, 큐, 쿼터로 팀 간 자원 경쟁을 통제
    - 실패 재시도, 중단 및 재개로 재실행 비용을 감소

### 4.3.2 운영 안정성

- 장애 대응 속도는 제품 경쟁력
- 엔터프라이즈 환경에서는 모델 생성보다 운영 중 장애를 빨리 잡아내는 것이 더 중요
- AI-Operations 핵심가치
    - 파이프라인 단계별 상태를 로그, 메트릭 및 트레이스와 연결
    - 실패 원인 분리
    - 자동 재시도 및 롤백 같은 운옆 패턴 표준화

### 4.3.3 재현성 및 추적성

- 감사 및 책임 그리고 분쟁 대응
- 엔터프라이즈에서는 왜 이 결과가 나왔는지 나중에 감사 받을 상황이 존재
- 예시
    - 어떤 데이터 버전으로 학습
    - 어떤 코드, 파라미터, 환경에서 실행
    - 어떤 평가를 통과해 배포
- AI-Operations는 예시를 증거로 남김

### 4.3.4 보안 및 거버넌스

- 엔터프라이즈에서 AI는 데이터가 민감하고 조직이 크기 때문에 누가 무엇을 할 수 있는지가 핵심
- 예시
    - RBAC : 역할 기반 권한
    - 프로젝트 및 팀 격리
    - 시크릿 관리 : API 키 및 DB 비밀번호, 토큰 등
    - 모델 및 데이터 접근 로그
    - 승인 게이트
- 즉, Zero Trust 및 컴플라이언스 기반이 됨

### 4.3.5 품질 유지와 성능 저하 대응

- 드리프트 및 피드백 루프
    - 모델은 배포 후 시간이 지나면 성능이 떨어질 가능성이 높음
    - 드리프트 감지 및 알림
    - 운영 지표 악화를 감지하면 재학습
    - 실패 케이스 수집하여 피드백
    - 데이터세트 업데이트
- 이 루프를 플랫폼화하여 자동화하지 않고 수동 대응하면 품질이 무너질 가능성이 높음

### 4.3.6 개발 생산성

- 팀마다 노트북과 스크립트로 운영
    - 파이프라인 중복 개발
    - 평가 기준 및 지표 제각각
    - 배포 방식 제각각
    - 운영자가 매번 다른 방식으로 트러블 체크
- AI-Operations은 파이프라인 템플릿 및 표준 모듈로 새 모델 및 새 도메인 확장을 빠르게 달성함

### 4.3.7 멀티 도메인 및 멀티 시스템의 허브 역할

- 현실 엔터프라이즈 환경에서는 CV, LLM, 오디오, 시계열 등 각기 따로 개발 가능성이 높음
- AI-Operations은 공통 운영 레이러를 제공
    - 도메인이 달라도 운영 방식 통일
    - 온프레미스, 클라우드, 하이브리드 환경에도 이식성 높음
- 장기적으로 플랫폼으로써 가치가 높아지고 제품 조직 확장 속도를 올려줌

## 4.4 AI-Operations 시스템

### 4.4.1 시스템 구성도

![image.png](attachment:b3799ace-d0fe-4a8e-b30b-f9a9cb17568d:image.png)

### 4.4.2 데이터 DB 구조

![image.png](attachment:90f301d9-4564-417c-8987-1d555a37d8d1:image.png)

### 4.4.3 AI-Operations 프론트엔드

1. 홈 (Home)
    - 헤더 및 CTA
        - Welcome 배너
        - New Pipeline
        - View Dashboard 빠른 진입
    - 통계 카드
        - Active Runs
        - Deployed Models
        - Active Alerts
        - Total Models
        - 변화 지표
    - Recent Runs
        - 상태 아이콘 및 배지
        - 진행률 바
        - 클릭 시 Run 상세 이동
    - 빠른 작업
        - 파이프라인 생성 및 배포
        - 모니터링으로 바로 이동
    - 시스템 상태/비용
        - GPU, Memory, Storage 사용률 바
        - 월간 비용 카드
2. 모니터링 대시보드 (Global Monitoring Dashboard)
    - 메트릭 카드
        - Active Runs
        - Alerts
        - Avg Latency
        - GPU Usage
        - 트렌드
    - 트래픽 및 요청량
        - 시간 범위(1h/6h/24h/7d) 토글
        - 차트 영역
    - 최근 알림
        - 심각도 표시 리스트
        - 알림 페이지 이동 버튼
    - 배포 상태
        - 엔드포인트별 요청, 지연, 에러율,상태 테이블 표시
    - 새로고침
        - 수동 Refresh 버튼
3. CV 대시보드 (Computer Vision Dashboard)
    - KPI:
        - Training Success Rate
        - mAP@0.5
        - Dataset Growth
        - Active Alerts
    - Recent Runs
        - Training, Eval, Deploy 유형 표시
        - 상태, 성능(mAP),시간 테이블 표시
    - 품질 경고
        - 데이터 및 라벨 품질 경고 카드(critical, warning, info)
    - 액티브 러닝 큐
        - 불확실도 기반 샘플 그리드 및 오버레이
        - 라벨링 전송
    - 빠른 작업
        - View Reports
        - New Training 버튼
4. LLM 대시보드 (NLP/LLM Dashboard)
    - KPI
        - Model Accuracy
        - Safety Pass Rate
        - RAG Index Status
        - Token Cost(24h)
    - 최근 작업
        - SFT, LoRA, DPO, Eval, Index 작업 리스트(손실, 상태, 시간등)
    - Safety & Policy
        - Jailbreak, PII, 정책 알림 리스트
    - 모델 단계
        - production, staging, dev 단계
        - 버전/요청량 표시
    - 비용 분석
        - Training, Inference, Embeddings 비용 막대
        - 토큰 사용량
5. Audio 대시보드 (Speech/Audio Dashboard)
    - KPI
        - ASR WER
        - TTS MOS
        - Streaming RTF
        - Audio Hours
    - 최근 작업
        - ASR/TTS/VC/Music 작업 테이블
        - 지표/상태
    - 품질 경고
        - clipping, low SNR 등 품질 경고 카드
    - 서빙 엔드포인트
        - 상태, latency, QPS, RTF 표시
    - 데이터 분포
        - ASR, TTS, Music 데이터 분포
        - 총 세그먼트/평균 길이
6. Multimodal 대시보드 (Multimodal Dashboard)
    - KPI
        - Pairing 규모
        - Pairing 품질
        - 주간 비용
        - Safety Pass Rate
    - 모델 버전
        - Production, Staging 단계
        - 모달리티
        - 업데이트 시간
    - 페어링 품질
        - 이미지, 비디오, 오디오 매칭 품질 과정
    - Recent Runs
        - 최근 학습 상태 ,정확도 및 진행률
    - 비용 요약
        - Frames, Tokens, GPU hours 요약 카드
    - Safety Gate
    - 항목별 PASS, Warn 상태 리스트
7. Time Series / Tabular 대시보드
    - 기간 선택
        - 24h, 7d, 30d, 90d
        - refresh
    - KPI
        - Forecasting MAPE
        - Anomaly Precision, Recall, Active Alerts, Inference Cost
    - 백테스트 결과
        - Sharpe, Returns, Drawdown 테이블
        - Actual 과 Predicted 차트 영역
    - 데이터 품질 경고
        - 결측, 드리프트, 이상치 경고 리스트
    - 재학습 스케줄
        - 모델별 재학습 일정 및 트리거 상태
    - 성능 요약
        - Forecasting(MAPE, MAE, RMSE)
        - Anomaly(Precision/Recall/F1) 카드

### 4.4.4 AI-Operations 백엔드

- 기능
    1. 로그인 / 테넌시 / 접근 제어
        - 조직(Org)·워크스페이스(Workspace) 선택/전환
        - 멀티테넌시 컨텍스트 확정
        - 사용자/역할/RBAC
        - API Key 발급·회수·마스킹(표시 정책)
        - 세션/토큰 갱신
        - 계정 상태(활성/정지) 처리
        - 시크릿(연결정보/토큰/키) 저장·조회(권한 기반) 및 접근 감사 로그 남김
    2. 홈 / 글로벌 대시보드(모니터링)
        - KPI 집계 API
            - Active Runs
            - Deployed Models
            - Active Alerts
            - 비용 및 리소스 요약
        - 시간범위 기반 차트 API
            - 요청량, 지연, 에러율, 리소스 사용 트렌드(1h/6h/24h/7d 등)
        - 시스템 헬스 API
            - DB, 오브젝트스토리지, 워크로드 실행 엔진(K8s)
            - 모니터링 스택 상태
        - 최근 활동/이벤트 피드
            - 파이프라인, 모델, 배포, 알림 변경 이력 스트림
    3. 파이프라인 / DAG 관리
        - 파이프라인 CRUD
            - 도메인 타입별 파이프라인 템플릿 생성 및 복제 그리고 버전관리
        - 그래프 저장/검증
            - node/edge 유효성
            - 파라미터 스키마 검증
            - 템플릿 오류 검사
        - 스케줄/트리거
            - Cron
            - 이벤트(새 데이터/새 라벨/드리프트) 기반 트리거 등록
        - 실행 정책
            - 재시도, 타임아웃, 중단 및 재개
            - 승인 게이트(배포 전 승인 등) 설정
    4. 실행(Runs) / 태스크(Tasks) 오케스트레이션
        - Run 생성, 시작, 중단, 재개, 재실행 API
        - 상태 머신 관리(pending/running/succeeded/failed/…)
        - 노드에서 런타임 변환
            - 각 노드를 Job, Container, Task로 매핑(리소스 프로파일 포함)
        - 태스크별 로그/아티팩트 링크
            - log URI
            - artifact URI(오브젝트 스토리지) 연결
        - 비용/리소스 사용량 정산
            - run 단위 cost
            - GPU, CPU, 메모리 사용 기록 수집 및 집계
    5. 데이터 관리(Connections / Datasets / Versions / Validation / Lineage)
        - 커넥션 관리: DB/S3/MinIO 등 연결 생성·테스트·상태 체크 + 시크릿 참조
        - 데이터셋/버전 관리: 스냅샷(해시/URI), 파티션, 스키마/컬럼 메타 관리
        - 검증(Validation): 스키마/결측/중복/이상치/분포 변화 체크 실행 및 리포트 저장
        - 계보(Lineage): 데이터→피처→모델→배포 연결 그래프 생성/조회(엣지 기반)
    6. 실험 / 평가 / 리포트
        - 실험(Experiment) 관리: 실험 생성, run 연결, 메트릭 비교/랭킹
        - 평가 스위트 실행: 도메인별 표준 지표 계산 + 리그레션(고정 벤치) 평가
        - 에러 분석/샘플링: 실패 케이스 큐(대표 샘플), 구간별 성능 분해 리포트
    7. 모델 레지스트리 / 버전 / 스테이지
        - 모델/버전 CRUD
            - 버전
            - 스테이지(dev, stage, prod)
            - 메타데이터 및 아티팩트 등록
        - 모델 카드/문서화
            - 모델 카드(MD) 저장
            - 평가 결과 및 데이터 계보 연결
        - 승격/롤백
            - 스테이지 승격 승인 플로우
            - 배포/엔드포인트와 연결된 롤백 지원
    8. 배포(Endpoints, Releases) 및 트래픽 제어
        - 엔드포인트 생성/수정
            - realtime과 batch 타입
            - 스케일, 리소스, 환경 설정
        - 릴리즈 및 버전 라우팅
            - 모델 버전 연결
            - 트래픽 퍼센트
            - stage 별 라우팅
        - 롤아웃 전략
            - canary, AB, blue-green 설정
            - 배포 상태 및 지표 기반 자동 중단(가드레일)
        - 배치 잡
            - 스케줄 기반 배치 추론
            - 결과 URI 저장 및 조회
    9. 운영 모니터링 / 드리프트 / 알림 / 피드백(재학습)
        - 모니터 룰 관리
            - 데이터, 모델, 엔드포인트 스코프별 룰 등록(PSI, KS, 성능, 비용 등)
        - 알림 생성/집계
            - severity
            - cooldown, dedup, aggregation 적용
            - 알림 이벤트 저장
        - 피드백 아이템
            - 알림 기반 트리아지, 라벨링, 재학습 요청 생성 및 상태 관리
        - 재학습 트리거
            - 조건 충족 시 파이프라인 자동 실행(승인 게이트 옵션)
    10. 도메인별 백엔드 모듈(공통 API 위에 얹는 “확장 플러그인”)
        - CV
            - 라벨, 학습. 평가, Export 파이프라인 템플릿
            - 액티브러닝 큐
            - mAP/품질 리포트
        - LLM
        - 데이터 정제·토크나이즈·학습(SFT/LoRA/DPO)·평가(안전/회귀), RAG 인덱싱, Agent 실행 로그
        - Audio
            - ASR, TTS, VC, Music 파이프라인
            - WER, MOS, RTF 지표
            - 스트리밍 품질 모니터
        - Multimodal
            - 페어링 정합 및 정렬
            - 멀티모달 평가
            - 비용(Frames, Tokens) 기반 정책 및 게이트
        - TimeSeries
            - 피처 및 윈도우링
            - 백테스트 및 워크포워드
            - 임계값 튜닝 및 트리아지
            - TS 전용 모니터링
    11. 감사 / 관측 / 운영 도구
        - 감사 로그
            - 모든 변경, 실행, 배포, 권한 이벤트를 before 및 after로 저장
        - 실시간 스트림
            - 런 상태, 알림, 배포 이벤트를 SSE 및 WS로 푸시
        - 운영 진단:
            - “왜 실패했는지”를 로그, 메트릭, 트레이스. 아티팩트로 연결하는 디버그 API

---

- 라이브러리 (Go 기준 권장)
    1. **HTTP/API**
        - github.com/go-chi/chi/v5 — 라우팅
        - github.com/go-chi/cors — CORS
        - github.com/go-chi/chi/v5/middleware — 공통 미들웨어(리퀘스트ID, 타임아웃, 로깅 등)
        - github.com/getkin/kin-openapi — OpenAPI 스펙/요청 스키마 검증(선택)
    2. **인증/권한/테넌시**
        - github.com/golang-jwt/jwt/v5 — JWT(세션/서비스 토큰)
        - golang.org/x/oauth2 — OAuth2(SSO 연동이 필요할 때)
        - github.com/casbin/casbin/v2 — RBAC/ABAC 정책 엔진(선택, 자체 RBAC도 가능)
        - github.com/hashicorp/vault/api — 시크릿 관리(Vault 선택 시)
    3. **Workflow / Queue / Orchestration**
        - k8s.io/client-go — Kubernetes API 연동(Job/Pod/CRD 제어)
        - sigs.k8s.io/controller-runtime — Operator/CRD 컨트롤러(확장 시)
        - github.com/hibiken/asynq — Redis 기반 백그라운드 잡/큐(경량)
        - github.com/temporalio/sdk-go — 워크플로우 오케스트레이션(복잡한 사가/재시도에 강함, 선택)
    4. **데이터 / 스토리지 / 마이그레이션**
        - gorm.io/gorm — ORM
        - gorm.io/driver/postgres — Postgres 드라이버
        - github.com/jackc/pgx/v5 — 고성능 Postgres 드라이버/풀(직접 SQL 선호 시)
        - github.com/golang-migrate/migrate/v4 — 마이그레이션
        - github.com/minio/minio-go/v7 — S3/MinIO 오브젝트 스토리지(artifact/log URI 저장)
        - github.com/google/uuid — UUID
    5. **관측/로깅/메트릭/트레이싱**
        - go.uber.org/zap — 구조화 로깅
        - github.com/prometheus/client_golang/prometheus — 메트릭
        - go.opentelemetry.io/otel — 트레이싱/메트릭 OTEL
        - github.com/r3labs/sse/v2 — SSE(런/알림 실시간 푸시)
        - nhooyr.io/websocket — WebSocket(선택)
    6. **검증/설정/유틸**
        - github.com/go-playground/validator/v10 — 요청 검증
        - github.com/spf13/viper — 설정 관리
        - github.com/rs/cors — CORS(chi 외 프레임워크 사용 시)
        - github.com/robfig/cron/v3 — 스케줄러(Cron 트리거)

### 4.4.5 프로젝트 업무 구조

- 그림 구조
- 기능 단위로 분류
    1. 테넌시 및 워크스페이스 컨텍스트 (Tenant & Workspace Context)
        - **테넌시(ORG & WS)**
            - 조직(Org) 과 워크스페이스(Workspace) 생성, 조회, 수정, 비활성
            - 사용자 로그인 후 “현재 선택된 Workspace” 컨텍스트 확정(헤더 및 사이드바 기준)
            - 워크스페이스별 리소스 격리(데이터, 파이프라인, 모델, 배포, 알림)
        - **권한 범위(SCOPE)**
            - Org 및 Workspace 범위 권한 스코프 설계 및 강제(모든 API에 workspace_id 컨텍스트)
            - 멀티 도메인(CV, LLM, Audio, Multimodal, TimeSeries) 라우팅 시 동일 스코프 유지
        - **감사 및 정책(AUDIT)**
            - Workspace 전환, 변경 이벤트 감사 로그 기록
            - 테넌시 범위 변경(멤버 추가 및 역할 변경) 시 추적 가능하게 before 및 after 저장
    2. 로그인/세션/키 관리 (AuthN Session)
        - **인증 및 세션(AUTHN)**
            - 로그인(SSO 및 OIDC 또는 로컬 계정 옵션)
            - Access 및 Refresh 토큰 발급, 갱신, 로그아웃
            - API Key 발급, 회수, 만료, 마스킹(표시 정책) 및 last_used_at 기록
            - 토큰 및 키 유효성 검증
            - 요청별 subject 및 user 컨텍스트 구성
        - **시크릿 및 자격증명(SECRET)**
            - 커넥션, 서빙, 외부연동에 필요한 시크릿 저장 및 조회(권한 기반)
            - 시크릿 접근 로그(누가, 언제, 무엇을) 감사 이벤트로 남김
        - **운영/보안(SECOPS)**
            - 비정상 요청(키 유출 및 과다 호출) 탐지 포인트(레이트리밋, 차단, 회수)
            - 토큰 및 키 회수 시 즉시 무효화(강제 로그아웃 및 키 폐기) 시나리오
    3. API 진입점 및 공통 미들웨어 (Gateway & Common Middleware)
        - **요청 표준화(API)**
            - Request-ID 및 Trace-ID 부여
            - 공통 로깅, 메트릭, 트레이싱 적용
            - 4xx 및 5xx 에러 규격(표준 에러 바디) 통일
            - 프론트에서 원인 표시 가능
        - **컨텍스트(CTX)**
            - workspace_id, role, permission 등을 request context에 주입
            - 도메인별 API라도 동일한 권한 및 스코프 검증 루틴 재사용
        - **입력 검증(VALIDATION)**
            - 그래프, 스키마, 파라미터 입력에 대한 서버 측 검증(클라이언트 신뢰 금지)
            - 파일 업로드 및 URI 등록 시 형식 및 크기 그리고 타입 검증
    4. 파이프라인/DAG 관리 (Pipelines & DAG)
        - **파이프라인(PIPE)**
            - Pipeline CRUD(도메인 타입 포함), 템플릿, 복제, 태깅, 검색
            - Pipeline Versioning
                - graph_json 스냅샷
                - created_by
                - 변경 이력
        - **그래프 검증(GRAPH)**
            - 노드 및 엣지 유효성(사이클 금지, required input 충족)
            - 노드별 config 스키마 검증(버전별 호환성 포함)
        - **스케줄 및 트리거(SCHED & TRIGGER)**
            - Cron 스케줄 등록, 활성, 비활성
            - 타임존 처리
            - 이벤트 트리거(새 데이터 버전, 드리프트, 알림, 피드백) 다음 파이프라인 실행 연결
        - **정책 및 가드레일(GUARDRAIL)**
            - 실행 승인 게이트(예: prod 배포 전 승인)
            - 실행 정책(최대 동시 실행, 재시도, 타임아웃, 우선순위 큐 연결)
    5. 실행(Runs) 및 태스크(Tasks) 오케스트레이션 (Execution Orchestration)
        - **런 관리(RUN)**
            - Run 생성, 시작, 중단, 재개, 재실행
            - 상태 머신 관리
            - Trigger 타입 기록(manual, schedule, event, api)
            - initiator 추적
        - **태스크 관리(TASK)**
            - 노드 단위 태스크 생성
            - retry_count, resource_profile 연결
            - 태스크별 상태, 시작, 종료 시각 및 실패 원인(에러 코드 및 메시지) 저장
        - **런타임 변환(RUNTIME)**
            - node에서 Job, Container, Task로 매핑(리소스, 환경변수, 볼륨, 이미지)
            - 실행 엔진(Kubernetes) 제출, 상태 폴링, 이벤트 수집
        - **로그 및 아티팩트(OBS & ARTIFACT)**
            - task_logs
                - 로그 URI 연결(오브젝트 스토리지 및 로깅 시스템)
            - artifacts’
                - 모델, 리포트, 스냅샷, 커브 등 결과물 URI 및 metadata 저장
        - **비용/리소스(COST)**
            - Run 단위 비용 산정(학습, 추론, 임베딩 등 breakdown)
            - GPU, CPU, 메모리 사용량 수집 및 집계(대시보드 KPI에 사용)
    6. 데이터 관리 (Connections / Datasets / Versions / Validation / Lineage)
        - **연결 관리(CONN)**
            - DB, S3, MinIO, 외부 API 커넥션 생성 및 테스트 그리고 상태 관리
            - secret_ref 기반 시크릿 참조(비밀번호, 토큰 DB에 평문 저장 금지)
        - **데이터셋 및 버전(DATASET)**
            - Dataset CRUD 와 Version 스냅샷(storage_uri, hash, size, row_count)
            - 파티션, 컬럼, 통계 저장(품질, 드리프트, 피처에 재사용)
        - **검증 및 품질(VALIDATION & QUALITY)**
            - 품질 리포트 생성(결측, 중복, 범위, 분포) 및 체크별 결과 저장
            - drift_report 생성(베이스라인 버전 대비) 및 details_json 저장
        - **계보(LINEAGE)**
            - 데이터 → 피처→모델→엔드포인트 연결 edge 생성 및 조회
            - “왜 이 결과가 나왔는지”를 버전 단위로 추적 가능하게 제공
    7. 피처 파이프라인 및 피처 스토어 (Feature Engineering & Feature Store)
        - **피처 파이프라인(FE-PIPE)**
            - feature_pipelines 및 feature_nodes 관리(그래프 기반 피처 생성)
            - point-in-time join 설정 저장(시계열 누수 방지)
        - **피처 버전/정의(FE-VERSION)**
            - feature_set/version 발행과 feature_definitions(윈도우/lag/agg)
            - storage_uri로 머티리얼라이즈된 피처 결과 연결
        - **머티리얼라이제이션(MAT)**
            - 오프라인 및 온라인 스토어 구분(store_type)
            - 주기적 materialization, last_run_at, 실패 재시도 및 상태 노출
    8. 실험/평가/리포트 (Experiments & Evaluation)
        - **실험(EXP)**
            - Experiment 생성
            - Run 연결(experiment_runs)
            - 메트릭 기준 비교
            - 대시보드 및 리더보드에 필요한 랭킹과 요약 제공
        - **평가 스위트(EVAL)**
            - 도메인별 표준 지표 계산(CV mAP, LLM 정확도 및 안전, Audio WER 및 MOS, TS MAPE 등)
            - 회귀(Regression) 평가
                - 이전 prod/stage 대비 성능 하락 탐지
        - **에러 분석(ERROR-ANALYSIS)**
            - segment_key 기반 성능 분해 저장
            - 실패 케이스 샘플링/큐 생성
            - 리포트 아티팩트(커브, 표. 샘플) URI로 연결
    9. 모델 레지스트리/버전/스테이지 (Model Registry)
        - **모델 및 버전(MODEL)**
            - models 및 model_versions CRUD
            - stage(dev, stage, prod) 관리
            - source_run_id로 “어떤 Run에서 나온 모델인지” 추적
        - **아티팩트 및 메트릭(ART & METRIC)**
            - model_artifacts
                - weights, config, tokenizer 등 URI 관리
            - model_metrics
                - 지표 저장(대시보드 KPI 및 게이트 판단에 사용)
        - **문서 및 컴플라이언스(DOC)**
            - model_cards(MD) 저장
                - 데이터, 평가, 제약, 리스크 서술
            - model_lineage로 dataset, feature, backtest 연결(감사 대응)
    10. 배포/엔드포인트/릴리즈/트래픽 (Serving & Release)
        - **엔드포인트(ENDPOINT)**
            - realtime/batch 엔드포인트 생성
            - URL/설정(config_json) 관리
            - 헬스, 레플리카, 지연. 처리량 등 런타임 상태 집계
        - **릴리즈 및 라우팅(ROUTING)**
            - endpoint_versions로 모델 버전 연결 및 traffic_percent 그리고 stage
            - 프로덕션과 스테이징 분리 운영 및 라우팅 룰 제공
        - **롤아웃(ROLLOUT)**
            - canary, ab, bluegreen 전략 저장(rollout_plans)
            - 가드레일
                - 에러율, 지연, 비용 기준 자동 중단 및 롤백 트리거
        - **배치 잡(BATCH)**
            - batch_jobs 스케줄 실행
            - output_uri 저장 및 조회
    11. 운영 모니터링/알림/피드백/재학습 (Monitoring & Feedback Loop)
        - **모니터 룰(MONITOR)**
            - monitor_rules
                - scope(dataset, model, endpoint)과 rule_type 그리고 config_json
            - drift_metrics
                - PSI 및 KS 등 지표 적재(시간 축 조회)
        - **알림(ALERT)**
            - alert_rules
                - 조건, 심각도, cooldown 정의
            - alerts/alert_events
                - 발생, 상세, 컨텍스트 저장(대시보드 Recent Alerts)
        - **피드백 및 재학습(FEEDBACK/RETRAIN)**
            - feedback_items
                - 트리아지, 라벨, 노트, 상태 관리
            - retrain_requests
                - 데이터 버전 지정 재학습 요청 및 상태 관리
        - **알림 폭주 방지(FLOOD)**
            - cooldown, dedup, aggregation 상태를 서버에서 보장(대시보드 요약에 사용)
    12. 도메인별 확장 모듈 (Domain Extensions)
        - **CV(CVOPS)**
            - 라벨링 및 액티브러닝 큐 연동(샘플 그리드·불확실도 기반)
            - 학습/평가 파이프라인 템플릿
            - mAP/품질 리포트 아티팩트
        - **LLM(LLMOPS)**
            - 데이터 파이프라인(정제/토크나이즈)
            - 학습(SFT/LoRA/DPO)
            - 평가(안전/회귀)
            - RAG 인덱싱 작업 과 인덱스 상태
            - Agent 실행 로그 및 트레이스 연결
        - **Audio(AUDIOOPS)**
            - ASR, TTS, VC, Music 워크플로우
            - WER/MOS/RTF/품질 경고 생성
        - **Multimodal(MMOPS)**
            - 페어링 정합 및 정렬 작업
            - Safety Gate
            - 비용(Frames 및 Tokens) 집계
        - **TimeSeries(TSOPS)**
            - 백테스트, 워크포워드, 폴드 및 임계값 튜닝
            - 트리아지 케이스 관리
    13. 리소스/큐/비용/거버넌스 (Resource, Cost & Governance)
        - **리소스(RES)**
            - compute_targets
                - 클러스터, 노드풀, 런타임 타겟 정의
            - resource_profiles
                - CPU, Mem, GPU 프리셋
                - spot 여부
            - queues:
                - 동시성 제한 및 우선순위 운영(팀별 쿼터로 확장 가능)
        - **비용(COST)**
            - usage_costs
                - run_id별 amount 및 breakdown 저장
            - budgets
                - 월 한도 및 알림 임계값
                - 초과 시 실행 제한(정책) 연동 가능
        - **거버넌스(GOV)**
            - 접근 제어(RBAC)
            - 시크릿/연결 권한
            - 승인 게이트
            - 감사 로그 표준화
    14. 감사/실시간/관측성 (Audit & Observability)
        - **감사 로그(AUDIT)**
            - 인증, 키 사용, 권한 변경, 파이프라인 변경 및 배포
            - 이벤트를 before 및 after로 저장
            - 엔티티별(entity_type 및 entity_id) 추적 및 기간과 사용자 필터 제공
        - **실시간 스트림(REALTIME)**
            - Runs 및 Tasks 상태 변경
            - Alerts 발생
            - Deployments 상태를 SSE 또는 WS로 푸시
        - **관측성(OBS)**
            - 구조화 로깅(zap)
            - Prometheus 메트릭
            - OpenTelemetry 트레이싱
            - “대시보드 KPI/테이블”에 필요한 집계 쿼리 및 캐시 전략 포함
        - **장애 분석(OPS)**
            - 실패 원인을 run 및 task 단위로 분리(런타임 실패, 데이터 검증 실패, 평가 게이트 실패)
            - trace-id, log-uri, artifact-uri로 클릭 한 번에 원인 증거로 이동 가능하게 설계
