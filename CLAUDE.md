# Claude.md — UI 품질 비교용 코딩 에이전트 과제 (Dashboard 앱)

이 문서는 **여러 환경(IDE/CLI/웹)에서 코딩 에이전트가 생성하는 UI 코드의 품질을 비교**하기 위한 단일 과제 스펙입니다.  
목표는 기능 자체보다 **UI 완성도, 정보 구조, 접근성, 반응형, 상태 관리, 코드 품질**을 비교 가능하게 만드는 것입니다.

## 중요
**fontend-design skill**을 활용한다.

---

## 1) 앱 선정: “OpsPulse — 서비스 운영 대시보드(모의 데이터)”

### 왜 이 앱인가 (UI 비교 관점)
- **다중 정보 밀도 UI**: KPI 카드 + 차트 + 테이블 + 필터 조합
- **상태 다양성**: 로딩/빈 상태/에러/필터 적용/정렬/페이지네이션
- **디자인 디테일**: 다크모드, 레이아웃 그리드, 타이포 스케일, 컴포넌트 일관성
- **접근성/키보드 내비**: 실무 UI 품질을 가르는 지점이 명확
- **백엔드 없이도 충분**: 고정/생성된 mock data로 재현성 높음

---

## 2) 기술 스택 (권장, 단 에이전트 환경에 맞게 조정 가능)
**필수 조건(최소):**
- React 18+
- TypeScript
- Vite (또는 동급의 빠른 dev 서버)
- TailwindCSS
- (가능하면) shadcn/ui 컴포넌트, lucide-react 아이콘, recharts 차트

> 위 라이브러리를 못 쓰는 환경이면, 동일 기능을 직접 구현해도 됨.  
> 단, **UI 품질과 접근성**을 떨어뜨리는 이유가 되면 감점.

---

## 3) 앱 범위 및 화면 구성

### 라우팅(페이지 3개)
1. **Overview (/)**
2. **Incidents (/incidents)**
3. **Settings (/settings)**

상단에 App Shell(고정 헤더 + 좌측 사이드바) 제공:
- 좌측 사이드바: Overview / Incidents / Settings
- 헤더: 앱명, 전역 검색(비활성 가능), 다크모드 토글, 사용자 메뉴(모의)

#### 공통 UI 요구
- 반응형: 모바일(≤640px), 태블릿(≤1024px), 데스크탑(>1024px)
- 다크모드 지원(토글로 즉시 전환), 사용자 설정은 localStorage에 저장
- “빈 상태/에러/로딩” 컴포넌트는 재사용 가능하도록 분리
- 모든 주요 인터랙션에 키보드 포커스 링, aria-label 또는 접근성 텍스트

---

## 4) 상세 기능 요구사항

### 4.1 Overview 페이지
**A. KPI 카드 4개**
- 예: Uptime(%) / Open Incidents / Mean Time To Resolve(MTTR) / Deploys(7d)
- 각 카드: 값 + 전일 대비 변화(▲/▼) + 작은 설명(tooltip 가능)

**B. 차트 2개**
1) 7일간 “Incident Count (by severity stacked)”  
2) 24시간 “Request Latency p50/p95” (라인)

- recharts 사용 권장. 불가 시 SVG/Canvas 또는 다른 차트 라이브러리도 OK.
- 차트는 **툴팁, 범례, 축 레이블** 포함

**C. “Recent Incidents” 테이블**
- 컬럼: ID, Title, Severity, Status, Started, Owner
- 기본 정렬: Started desc
- 행 클릭 시 /incidents?selected=<id> 로 이동(선택 강조)

**상태**
- 로딩: 스켈레톤 UI(카드/차트/테이블 각각)
- 빈 상태: “최근 7일간 인시던트 없음” + 버튼(모의)  
- 에러 상태: “데이터를 불러오지 못했습니다” + Retry

> 실제 네트워크 호출은 하지 말고, 300~700ms 정도 setTimeout으로 지연을 주어 로딩 상태를 재현.

---

### 4.2 Incidents 페이지
**A. 필터 패널**
- Severity: P0/P1/P2/P3 (멀티 선택)
- Status: Open / Monitoring / Resolved
- Date range: 최근 24h / 7d / 30d
- Search: 제목/소유자 검색
- “Reset” 버튼

**B. 테이블**
- 컬럼: ID, Title, Service, Severity, Status, Started, Duration, Owner
- 정렬 가능(Started, Severity, Duration)
- 페이지네이션(예: 10개/페이지)
- 행 클릭 → 오른쪽에 **상세 패널(사이드 드로어)** 표시

**C. 상세 패널(드로어)**
- 제목, 배지(Severity/Status)
- 타임라인(“Detected → Mitigated → Resolved” 같은 단계, 모의)
- 코멘트 리스트(모의) + “Add comment”(local only)
- 상태 변경 버튼(모의): Resolve / Set Monitoring

**상태**
- 필터 결과 0건 시: 추천 액션(필터 완화) UI

---

### 4.3 Settings 페이지
- Theme: Light/Dark/System
- Density: Comfortable/Compact (테이블 row height 등 반영)
- Notifications: Email/Slack 토글(모의)
- “Reset to defaults” 버튼
- 모든 설정은 localStorage 저장

---

## 5) 데이터(모의) 요구
- 앱 내부에 seed 데이터를 포함(예: `src/data/mock.ts`)
- 인시던트는 최소 40개 이상(다양한 severity/status/date 분포)
- 차트용 시계열 데이터도 포함 또는 incidents에서 파생 생성
- **랜덤 생성도 가능**하나, 비교 재현성을 위해 “seed 고정” 권장(예: pseudo-random with fixed seed)

---

## 6) 코드 품질 요구
- TypeScript 엄격 모드 권장
- 컴포넌트 분리: AppShell, KPI 카드, ChartCard, DataTable, FilterBar, Drawer, EmptyState, ErrorState, Skeleton 등
- 상태 관리: React state + context 또는 zustand 등 가능(단 과도한 복잡성은 감점)
- 유틸: 날짜 포맷, severity 색/라벨 매핑, duration 계산 함수 등 분리
- 린트/포맷: ESLint + Prettier 권장(환경에 따라 생략 가능)

---

## 7) 접근성/UX 체크리스트(필수)
- 모든 버튼/입력 요소에 label/aria-label 제공
- 드로어 열릴 때 포커스 트랩(가능하면), ESC로 닫기
- 테이블 정렬 상태는 스크린리더에 전달(aria-sort)
- 색상만으로 상태 전달 금지(텍스트/아이콘/배지 병행)
- 로딩 중에는 사용자에게 상태가 명확히 보이도록(스켈레톤 + “Loading…” 텍스트(시각적으로 숨김 가능))

---

## 8) 평가 기준(비교용)
에이전트 산출물을 비교할 때 아래 항목을 채점(0~5) 권장:

1) **시각적 완성도**: 타이포/간격/그리드/일관성/다크모드  
2) **정보 구조**: 중요 정보 우선순위, 과밀/여백 균형  
3) **상태 설계**: 로딩/빈/에러/필터 0건 상태 처리  
4) **인터랙션 품질**: 드로어/정렬/필터/페이지네이션/미세 상호작용  
5) **접근성**: 키보드 내비, 포커스, aria, 대비  
6) **코드 품질**: 구조화, 재사용성, 타입 안정성, 테스트 용이성  
7) **성능 감각**: 불필요한 re-render 최소화, memoization 적절성(과하지 않게)

---

## 9) 산출물(필수)
- 실행 방법(README에 간단히): 설치/실행 명령
- 스크린샷 3장 이상(Overview/Incidents/Settings)
- (선택) Lighthouse 스코어 캡처(또는 접근성 체크 결과)

---

## 10) 구현 힌트(권장 패턴)
- AppShell: CSS grid로 `sidebar + main` 구성, header sticky
- 테이블: head 고정/스크롤 가능하면 가산점
- 배지: Severity(P0~P3)와 Status 색상 체계 일관되게
- Skeleton: 카드/차트/테이블에 맞춘 스켈레톤 컴포넌트화
- localStorage: `useLocalStorageState` 훅으로 캡슐화

---

## 11) 금지 사항
- 외부 API 호출(비교 재현성 저하)
- “기능만 되고 UI 대충” (이 과제의 목적은 UI 품질 비교)
- 한 페이지에 모든 걸 욱여넣기(정보 구조 평가 불리)

---

### 완료 정의(Definition of Done)
- 3개 페이지 라우팅이 동작한다.
- Overview에 KPI 4개, 차트 2개, 최근 인시던트 테이블이 있다.
- Incidents에서 필터/정렬/페이지네이션/드로어 상세가 동작한다.
- Settings 설정이 UI에 반영되고 localStorage에 저장된다.
- 로딩/빈/에러 상태가 최소 1곳 이상에서 실제로 확인 가능하다(모의 지연 포함).
- 다크모드가 전역적으로 동작한다.

