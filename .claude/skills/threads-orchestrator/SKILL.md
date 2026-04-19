---
name: threads-orchestrator
description: Threads Search 프로젝트 오케스트레이터. 새 기능 구현, 버그 수정, 아키텍처 변경, 전체 프로젝트 빌드를 조율한다. "threads 기능 구현", "새 기능 추가", "검색 개선", "인사이트 추가", "빌드 에러 수정", "프로젝트 셋업" 등 모든 개발 작업 시 반드시 이 스킬을 사용할 것.
---

# Threads Search Project Orchestrator

## 실행 모드
서브 에이전트 (Sub-agents) — 각 Phase가 독립적이며 결과를 순차 전달

## Phase 0: 컨텍스트 확인

1. `_workspace/` 디렉토리 존재 여부 확인
2. `package.json` 존재 여부 확인 (프로젝트 초기화 여부)
3. 사용자 요청 유형 판별:
   - **초기 셋업**: package.json 없음 → Phase 1-5 전체 실행
   - **기능 추가**: package.json 있음 + 새 기능 요청 → Phase 3-4 실행
   - **버그 수정**: 에러 메시지 포함 → Phase 4 + Phase 5 실행
   - **UI 수정**: 디자인 변경 요청 → Phase 3(UI만) + Phase 5 실행

## Phase 1: 아키텍처 설계

**에이전트**: `threads-architect` (sub-agent)
**입력**: 사용자 요청
**작업**:
- Next.js 프로젝트 구조 설계
- API 라우트 설계
- OAuth 플로우 설계
**출력**: `_workspace/architecture.md`

## Phase 2: Next.js 프로젝트 초기화 (초기 셋업만)

다음 명령을 순서대로 실행:

```bash
cd /Users/byunginsong/Documents/studio/threads-search

# 1. Next.js 프로젝트 생성
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-git \
  --yes

# 2. shadcn/ui 초기화
npx shadcn@latest init -y -d

# 3. 필수 shadcn 컴포넌트 추가
npx shadcn@latest add button input tabs avatar badge skeleton separator sheet

# 4. 필수 패키지 설치
npm install lucide-react date-fns
npm install --save-dev @types/node
```

## Phase 3: 구현

**에이전트**: `threads-implementer` (sub-agent)
**참조 스킬**: `threads-api`, `threads-ui`
**구현 순서**:
1. `lib/threads-api.ts` — API 유틸리티
2. `app/api/auth/route.ts` — OAuth 시작
3. `app/api/auth/callback/route.ts` — OAuth 콜백
4. `app/api/search/route.ts` — 검색 프록시
5. `app/api/insights/route.ts` — 인사이트 프록시
6. `components/thread-card.tsx` — ThreadCard 컴포넌트
7. `components/nav-bar.tsx` — NavBar (PC/모바일)
8. `components/search-bar.tsx` — SearchBar
9. `app/layout.tsx` — 루트 레이아웃 (테마 포함)
10. `app/page.tsx` — 홈 (검색 리다이렉트)
11. `app/auth/page.tsx` — 인증 페이지
12. `app/search/page.tsx` — 검색 페이지
13. `app/insights/page.tsx` — 인사이트 페이지
14. `.env.local.example` — 환경변수 예시
15. `SETUP.md` — 로컬 개발 가이드

## Phase 4: UI 에이전트

**에이전트**: `threads-ui-designer` (sub-agent)
**작업**: 각 컴포넌트의 UI 완성도 검토 및 개선
**참조 스킬**: `threads-ui`

## Phase 5: QA 검증

**에이전트**: `threads-qa` (sub-agent)
**작업**:
1. `npm run build` 실행 → 빌드 성공 확인
2. TypeScript 타입 검사
3. 필수 파일 존재 확인
4. API 경계면 정합성 확인
**출력**: `_workspace/qa-report.md`

빌드 실패 시 → `threads-implementer`에게 수정 요청 후 재검증

## 데이터 흐름
```
사용자 요청
  → Phase 0: 컨텍스트 확인
  → Phase 1: architecture.md 생성
  → Phase 2: npm 패키지 설치
  → Phase 3: 코드 구현
  → Phase 4: UI 개선
  → Phase 5: 빌드 검증
  → 사용자에게 결과 보고
```

## 테스트 시나리오
1. **정상 흐름**: 빈 프로젝트 → 전체 초기화 → 로컬 실행
2. **에러 흐름**: 빌드 실패 → QA 리포트 → 수정 → 재빌드

## 주의사항
- Phase 2는 초기 셋업 1회만 실행 (이미 package.json 있으면 건너뜀)
- `.env.local`은 생성하지 않음 (사용자가 직접 설정)
- `.env.local.example`은 반드시 생성
