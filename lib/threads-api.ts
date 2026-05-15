/**
 * Threads Graph API 공통 클라이언트 및 공유 타입.
 * 본인 게시물(/{userId}/threads) 및 인사이트(/{postId}/insights) 호출 전용.
 */

import { logServer } from '@/lib/log'

export const THREADS_API_BASE = 'https://graph.threads.net/v1.0'

export type MediaType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'

export interface ThreadPost {
  id: string
  text: string
  permalink: string
  timestamp: string
  username: string
  media_type: MediaType
  has_replies?: boolean
  is_quote_post?: boolean
  is_reply?: boolean
}

export interface MediaInsights {
  views: number
  likes: number
  replies: number
  reposts: number
  quotes: number
}

export interface PostWithInsights extends ThreadPost {
  insights: MediaInsights
}

export interface PagedResponse<T> {
  data: T[]
  paging?: { cursors?: { after?: string; before?: string }; next?: string }
}

export interface InsightMetric {
  name: keyof MediaInsights
  values: { value: number }[]
}

export const EMPTY_INSIGHTS: MediaInsights = {
  views: 0,
  likes: 0,
  replies: 0,
  reposts: 0,
  quotes: 0,
}

// 주의: is_reply, is_quote_post, has_replies 는 threads_manage_replies 권한이 필요하다.
// 현재 OAuth scope (threads_basic + threads_manage_insights) 로는 거부되므로 제외한다.
export const DEFAULT_POST_FIELDS =
  'id,text,permalink,timestamp,username,media_type'

/**
 * Threads Graph API GET 호출 헬퍼. 액세스 토큰을 자동으로 부착한다.
 * 로그에는 토큰을 항상 마스킹한다.
 */
export async function threadsGet<T>(
  path: string,
  params: Record<string, string>,
  accessToken: string
): Promise<T> {
  const url = new URL(`${THREADS_API_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  url.searchParams.set('access_token', accessToken)

  // 토큰 마스킹된 URL 로깅
  const maskedUrl = url
    .toString()
    .replace(/access_token=[^&]+/, 'access_token=***')
  logServer.debug('[threads-api] GET', maskedUrl)

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    logServer.error('[threads-api] error response', {
      status: res.status,
      url: maskedUrl,
      bodyLength: errorBody.length,
    })
    let parsed: {
      error?: {
        message?: string
        code?: number
        type?: string
        error_subcode?: number
      }
    } = {}
    try {
      parsed = JSON.parse(errorBody)
    } catch {
      // ignore
    }
    throw new Error(
      parsed.error?.message ?? `Threads API error: ${res.status}`
    )
  }
  return res.json() as Promise<T>
}
