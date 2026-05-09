import { SearchX } from 'lucide-react'
import { ThreadCard } from '@/components/thread-card'
import { EmptyState } from '@/components/empty-state'
import { getCachedMyPosts } from '@/lib/cache'
import type { ThreadPost } from '@/lib/threads-api'

interface MySearchResultsProps {
  q: string
  userId: string
  accessToken: string
}

type LoadResult =
  | { kind: 'ok'; matched: ThreadPost[]; total: number }
  | { kind: 'error'; message: string }

async function loadMatched(
  q: string,
  userId: string,
  accessToken: string
): Promise<LoadResult> {
  try {
    const posts = await getCachedMyPosts({
      userId,
      accessToken,
      excludeReplies: true,
    })
    const needle = q.toLowerCase()
    const matched = posts.filter((post) =>
      post.text?.toLowerCase().includes(needle)
    )
    return { kind: 'ok', matched, total: posts.length }
  } catch (error) {
    return {
      kind: 'error',
      message:
        error instanceof Error ? error.message : '검색에 실패했습니다',
    }
  }
}

export async function MySearchResults({
  q,
  userId,
  accessToken,
}: MySearchResultsProps) {
  const result = await loadMatched(q, userId, accessToken)

  if (result.kind === 'error') {
    return <EmptyState title="오류가 발생했습니다" description={result.message} />
  }

  if (result.matched.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-10 w-10" />}
        title="일치하는 게시물이 없습니다"
        description={`전체 ${result.total}개 중 매칭 0개`}
      />
    )
  }

  return (
    <div>
      <p className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
        &ldquo;{q}&rdquo; 결과 {result.matched.length}개 (전체 {result.total}개 중)
      </p>
      {result.matched.map((post) => (
        <ThreadCard key={post.id} post={post} />
      ))}
    </div>
  )
}
