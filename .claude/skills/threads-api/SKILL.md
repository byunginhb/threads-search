---
name: threads-api
description: Threads API 연동 스킬. OAuth 2.0 인증, 키워드 검색, 게시물 조회, 인사이트 조회 구현 패턴을 제공한다. Threads API 관련 코드 작성, OAuth 플로우 구현, API 에러 처리 시 반드시 이 스킬을 참조할 것.
---

# Threads API Integration

## 인증 (OAuth 2.0)

### App 등록 정보
- App ID: `THREADS_APP_ID` 환경변수
- App Secret: `THREADS_APP_SECRET` 환경변수
- Redirect URI: `{NEXT_PUBLIC_APP_URL}/api/auth/callback`

### Step 1: 인증 URL 생성
```
GET https://threads.net/oauth/authorize
  ?client_id={THREADS_APP_ID}
  &redirect_uri={REDIRECT_URI}
  &scope=threads_basic,threads_keyword_search,threads_manage_insights
  &response_type=code
```

### Step 2: Short-lived Token 교환
```
POST https://graph.threads.net/oauth/access_token
Body (form-data):
  client_id={THREADS_APP_ID}
  client_secret={THREADS_APP_SECRET}
  grant_type=authorization_code
  redirect_uri={REDIRECT_URI}
  code={CODE}
응답: { access_token, token_type, expires_in, user_id }
```

### Step 3: Long-lived Token 교환
```
GET https://graph.threads.net/access_token
  ?grant_type=th_exchange_token
  &client_secret={THREADS_APP_SECRET}
  &access_token={SHORT_LIVED_TOKEN}
응답: { access_token, token_type, expires_in }
```
Long-lived token은 60일 유효. 만료 전 갱신 가능.

### Token 저장
- httpOnly 쿠키에 저장 (XSS 방어)
- `user_id`도 별도 쿠키에 저장 (비httpOnly, 클라이언트 접근 허용)

## 키워드 검색 API

```typescript
interface SearchParams {
  q: string
  search_type?: 'TOP' | 'RECENT'  // 기본값: TOP
  search_mode?: 'KEYWORD' | 'TAG' // 기본값: KEYWORD
  media_type?: 'TEXT' | 'IMAGE' | 'VIDEO'
  since?: number  // Unix timestamp
  until?: number
  limit?: number  // 기본 25, 최대 100
  after?: string  // 페이지네이션 커서
}

interface ThreadPost {
  id: string
  text: string
  permalink: string
  timestamp: string
  username: string
  media_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  has_replies: boolean
  is_quote_post: boolean
  is_reply: boolean
}

// API 호출
GET https://graph.threads.net/v1.0/keyword_search
  ?q={keyword}
  &fields=id,text,permalink,timestamp,username,media_type,has_replies,is_quote_post,is_reply
  &search_type=TOP
  &limit=25
  &access_token={ACCESS_TOKEN}
```

레이트 리밋: 24시간 내 2,200 쿼리

## 내 게시물 조회 API

```typescript
// 사용자 게시물 목록
GET https://graph.threads.net/v1.0/{USER_ID}/threads
  ?fields=id,text,permalink,timestamp,media_type
  &access_token={ACCESS_TOKEN}

// 단일 게시물 인사이트
GET https://graph.threads.net/v1.0/{MEDIA_ID}/insights
  ?metric=views,likes,replies,reposts,quotes,shares
  &access_token={ACCESS_TOKEN}

interface MediaInsight {
  views: number
  likes: number
  replies: number
  reposts: number
  quotes: number
  shares: number
}
```

## Next.js API Route 패턴

```typescript
// lib/threads-api.ts
const THREADS_API_BASE = 'https://graph.threads.net/v1.0'

export async function threadsGet<T>(
  path: string,
  params: Record<string, string>,
  accessToken: string
): Promise<T> {
  const url = new URL(`${THREADS_API_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url.toString(), { next: { revalidate: 60 } })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message ?? `Threads API error: ${res.status}`)
  }
  return res.json()
}
```

## 에러 처리

| HTTP 상태 | 원인 | 처리 |
|---------|------|------|
| 401 | 토큰 만료/무효 | 재인증 유도 (쿠키 삭제 후 /auth로 리다이렉트) |
| 429 | 레이트 리밋 | Retry-After 헤더 참조, 429 그대로 클라이언트에 전달 |
| 400 | 잘못된 파라미터 | 에러 메시지 파싱 후 사용자 친화적 메시지 |
