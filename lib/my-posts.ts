/**
 * 내 Threads 게시물 + 인사이트를 가져오는 데이터 레이어.
 * - fetchMyPosts: 페이지네이션으로 사용자 게시물 수집
 * - fetchPostInsights: 단일 게시물의 메트릭 조회
 * - fetchMyPostsWithInsights: 게시물 + 인사이트를 chunk 단위로 병렬 처리
 */

import {
  threadsGet,
  DEFAULT_POST_FIELDS,
  EMPTY_INSIGHTS,
  type ThreadPost,
  type MediaInsights,
  type PostWithInsights,
  type PagedResponse,
  type InsightMetric,
} from '@/lib/threads-api'

const LOG_PREFIX = '[my-posts]'

interface FetchMyPostsOptions {
  accessToken: string
  userId: string
  /** 페이지당 limit (기본 100) */
  limit?: number
  /** 최대 페이지 수 (기본 20) */
  maxPages?: number
  /** is_reply=true 인 게시물 제외 여부 (기본 true) */
  excludeReplies?: boolean
  /** 사용자 정의 fields. 미지정 시 DEFAULT_POST_FIELDS */
  fields?: string
}

/**
 * 사용자 게시물을 페이지네이션으로 모두 수집한다.
 */
export async function fetchMyPosts({
  accessToken,
  userId,
  limit = 100,
  maxPages = 20,
  excludeReplies = true,
  fields = DEFAULT_POST_FIELDS,
}: FetchMyPostsOptions): Promise<ThreadPost[]> {
  console.log(`${LOG_PREFIX} fetchMyPosts start`, {
    userId,
    limit,
    maxPages,
    excludeReplies,
  })

  const collected: ThreadPost[] = []
  let after: string | undefined
  let page = 0

  while (page < maxPages) {
    const params: Record<string, string> = {
      fields,
      limit: String(limit),
    }
    if (after) params.after = after

    const res = await threadsGet<PagedResponse<ThreadPost>>(
      `/me/threads`,
      params,
      accessToken
    )

    const items = res.data ?? []
    if (items.length > 0) {
      // 불변 패턴: spread로 새 배열 생성
      collected.push(...items)
    }

    after = res.paging?.cursors?.after
    page += 1
    if (!after || items.length === 0) break
  }

  // is_reply 필드는 threads_manage_replies 권한이 필요해 현재 미요청 상태.
  // excludeReplies 옵션은 일단 무시하고 전체를 반환한다 (추후 scope 확장 시 활성화 가능).
  console.log(`${LOG_PREFIX} fetchMyPosts done`, {
    pages: page,
    rawCount: collected.length,
    excludeRepliesRequested: excludeReplies,
    note: 'reply filtering disabled (requires threads_manage_replies scope)',
  })

  return collected
}

/**
 * 단일 게시물의 인사이트(메트릭)를 가져온다. 실패 시 null.
 */
export async function fetchPostInsights(
  postId: string,
  accessToken: string
): Promise<MediaInsights | null> {
  try {
    const res = await threadsGet<{ data: InsightMetric[] }>(
      `/${postId}/insights`,
      { metric: 'views,likes,replies,reposts,quotes' },
      accessToken
    )
    return res.data.reduce<MediaInsights>(
      (acc, metric) => ({
        ...acc,
        [metric.name]: metric.values[0]?.value ?? 0,
      }),
      { ...EMPTY_INSIGHTS }
    )
  } catch (error) {
    console.error(`${LOG_PREFIX} fetchPostInsights failed`, {
      postId,
      error: error instanceof Error ? error.message : error,
    })
    return null
  }
}

interface FetchWithInsightsOptions extends FetchMyPostsOptions {
  /** 인사이트 호출을 몇 개씩 병렬로 묶을지 (기본 10) */
  chunkSize?: number
}

/**
 * 게시물 목록 + 각 게시물의 인사이트를 chunkSize씩 병렬로 가져온다.
 * 인사이트 실패 시 0으로 채운다 (게시물은 유지).
 */
export async function fetchMyPostsWithInsights(
  opts: FetchWithInsightsOptions
): Promise<PostWithInsights[]> {
  const { accessToken, chunkSize = 10 } = opts

  const posts = await fetchMyPosts(opts)
  console.log(`${LOG_PREFIX} fetchMyPostsWithInsights insights start`, {
    postCount: posts.length,
    chunkSize,
  })

  const result: PostWithInsights[] = []
  for (let i = 0; i < posts.length; i += chunkSize) {
    const chunk = posts.slice(i, i + chunkSize)
    const enriched = await Promise.all(
      chunk.map(async (post): Promise<PostWithInsights> => {
        const insights = await fetchPostInsights(post.id, accessToken)
        return { ...post, insights: insights ?? { ...EMPTY_INSIGHTS } }
      })
    )
    result.push(...enriched)
  }

  console.log(`${LOG_PREFIX} fetchMyPostsWithInsights done`, {
    total: result.length,
  })

  return result
}
