/**
 * unstable_cache 기반 사용자별 캐시 래퍼.
 * cookies/headers는 캐시 스코프 외부에서 접근하고, 인자로 전달해야 한다.
 * (Next.js 16: 'use cache' 디렉티브가 권장되지만 unstable_cache도 지원됨)
 */

import { unstable_cache, revalidateTag } from 'next/cache'
import {
  fetchMyPosts,
  fetchMyPostsWithInsights,
} from '@/lib/my-posts'
import type { ThreadPost, PostWithInsights } from '@/lib/threads-api'

const TTL_SECONDS = 300

const LOG_PREFIX = '[cache]'

const myPostsTag = (userId: string) => `my-posts:${userId}`
const insightsTag = (userId: string) => `my-posts-insights:${userId}`

interface BaseOpts {
  userId: string
  accessToken: string
  excludeReplies?: boolean
  limit?: number
  maxPages?: number
}

/**
 * 사용자 게시물 목록 (인사이트 없음) 캐시 적용 버전.
 * 캐시 키: userId + excludeReplies + limit + maxPages
 */
export function getCachedMyPosts(
  opts: BaseOpts
): Promise<ThreadPost[]> {
  const { userId, accessToken, excludeReplies = true, limit, maxPages } = opts
  const keyParts = [
    'my-posts',
    userId,
    String(excludeReplies),
    String(limit ?? 'd'),
    String(maxPages ?? 'd'),
  ]
  console.log(`${LOG_PREFIX} getCachedMyPosts`, { keyParts })

  const cached = unstable_cache(
    async () =>
      fetchMyPosts({
        accessToken,
        userId,
        excludeReplies,
        limit,
        maxPages,
      }),
    keyParts,
    {
      tags: [myPostsTag(userId)],
      revalidate: TTL_SECONDS,
    }
  )
  return cached()
}

/**
 * 사용자 게시물 + 인사이트 캐시 적용 버전.
 */
export function getCachedMyPostsWithInsights(
  opts: BaseOpts & { chunkSize?: number }
): Promise<PostWithInsights[]> {
  const {
    userId,
    accessToken,
    excludeReplies = true,
    limit,
    maxPages,
    chunkSize,
  } = opts
  const keyParts = [
    'my-posts-with-insights',
    userId,
    String(excludeReplies),
    String(limit ?? 'd'),
    String(maxPages ?? 'd'),
    String(chunkSize ?? 'd'),
  ]
  console.log(`${LOG_PREFIX} getCachedMyPostsWithInsights`, { keyParts })

  const cached = unstable_cache(
    async () =>
      fetchMyPostsWithInsights({
        accessToken,
        userId,
        excludeReplies,
        limit,
        maxPages,
        chunkSize,
      }),
    keyParts,
    {
      tags: [insightsTag(userId), myPostsTag(userId)],
      revalidate: TTL_SECONDS,
    }
  )
  return cached()
}

/**
 * 사용자별 캐시를 강제 무효화한다 (Server Action / Route Handler에서 호출).
 */
export function invalidateMyPostsCache(userId: string): void {
  console.log(`${LOG_PREFIX} invalidateMyPostsCache`, { userId })
  // Next.js 16: revalidateTag는 두 번째 인자로 profile(또는 expire 객체)을 요구
  revalidateTag(myPostsTag(userId), { expire: 0 })
  revalidateTag(insightsTag(userId), { expire: 0 })
}
