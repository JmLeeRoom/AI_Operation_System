# DataCatalog Frontend

데이터 카탈로그 플랫폼의 프론트엔드 UI입니다. 메타데이터 검색, 조회, 관리를 위한 현대적이고 직관적인 인터페이스를 제공합니다.

## 🚀 기술 스택

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Icons**: Lucide React

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # 공통 컴포넌트
│   │   │   ├── Badge.tsx    # 배지 컴포넌트
│   │   │   ├── Card.tsx     # 카드 컴포넌트
│   │   │   ├── Table.tsx    # 테이블 컴포넌트
│   │   │   └── index.ts
│   │   └── layout/          # 레이아웃 컴포넌트
│   │       ├── Header.tsx   # 헤더
│   │       ├── Layout.tsx   # 메인 레이아웃
│   │       └── Sidebar.tsx  # 사이드바 네비게이션
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── Dashboard.tsx    # 대시보드
│   │   ├── Catalogs.tsx     # 카탈로그 목록
│   │   ├── Tables.tsx       # 테이블 목록
│   │   ├── TableDetail.tsx  # 테이블 상세
│   │   ├── Search.tsx       # 검색 결과
│   │   └── index.ts
│   ├── App.tsx              # 라우팅 설정
│   ├── main.tsx             # 앱 진입점
│   └── index.css            # 글로벌 스타일
├── index.html
├── vite.config.ts
└── package.json
```

## 🎨 UI 페이지

### 1. Dashboard (`/dashboard`)
- 환영 배너 및 요약 통계
- 트렌딩 테이블 목록
- 빠른 접근 (즐겨찾기)
- 최근 활동 피드

### 2. Catalogs (`/catalogs`)
- 카탈로그 목록 (그리드/리스트 뷰)
- 플랫폼별 필터링 (Snowflake, BigQuery, PostgreSQL 등)
- 카탈로그별 테이블 수, 상태, 소유자 표시

### 3. Tables (`/tables`)
- 테이블 목록 및 검색
- 확장 가능한 행으로 상세 정보 표시
- 품질 점수, 태그, 소유자 정보

### 4. Table Detail (`/tables/:tableId`)
- 테이블 메타데이터 상세
- 컬럼 스키마 뷰
- 데이터 라인리지 시각화
- 최근 쿼리 이력
- 문서화 및 토론

### 5. Search (`/search`)
- 전체 텍스트 검색
- 타입/플랫폼/태그 필터
- 검색 결과 하이라이팅
- AI 검색 기능 (UI만)

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary (Brand)**: Sky Blue (#0ea5e9)
- **Background**: Dark Slate (#0d1117, #161b22)
- **Accent Colors**: Cyan, Emerald, Amber, Rose, Violet

### 컴포넌트 스타일
- Glass morphism 카드
- 다크 테마 최적화
- 부드러운 애니메이션
- 반응형 레이아웃

## 🔧 주요 기능 (UI Only)

> ⚠️ 현재는 UI 껍데기만 구현되어 있습니다. 백엔드 연동은 포함되어 있지 않습니다.

- [x] 대시보드 UI
- [x] 카탈로그 목록 UI
- [x] 테이블 목록 UI
- [x] 테이블 상세 UI (컬럼, 라인리지, 쿼리)
- [x] 검색 UI (필터, 결과)
- [x] 사이드바 네비게이션
- [x] 반응형 레이아웃
- [ ] 백엔드 API 연동
- [ ] 인증/인가
- [ ] 실제 데이터 바인딩

## 📝 라이센스

MIT
