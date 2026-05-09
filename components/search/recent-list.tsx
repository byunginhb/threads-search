import { FileText } from 'lucide-react'
import { ThreadCard } from '@/components/thread-card'
import { EmptyState } from '@/components/empty-state'
import { getCachedMyPosts } from '@/lib/cache'
import type { ThreadPost } from '@/lib/threads-api'

interface RecentListProps {
  userId: string
  accessToken: string
}

const RECENT_LIMIT = 10

type LoadResult =
  | { kind: 'ok'; posts: ThreadPost[] }
  | { kind: 'error'; message: string }

async function loadRecent(
  userId: string,
  accessToken: string
): Promise<LoadResult> {
  try {
    const posts = await getCachedMyPosts({
      userId,
      accessToken,
      excludeReplies: true,
      limit: RECENT_LIMIT,
      maxPages: 1,
    })
    return { kind: 'ok', posts: posts.slice(0, RECENT_LIMIT) }
  } catch (error) {
    return {
      kind: 'error',
      message:
        error instanceof Error ? error.message : '게시물을 불러오지 못했습니다',
    }
  }
}

export async function RecentList({ userId, accessToken }: RecentListProps) {
  const result = await loadRecent(userId, accessToken)

  if (result.kind === 'error') {
    return <EmptyState title="오류가 발생했습니다" description={result.message} />
  }

  if (result.posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-10 w-10" />}
        title="아직 게시물이 없습니다"
        description="Threads에 글을 작성하면 여기에 표시됩니다."
      />
    )
  }

  return (
    <div>
      <p className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
        최근 게시물 {result.posts.length}개
      </p>
      {result.posts.map((post) => (
        <ThreadCard key={post.id} post={post} />
      ))}
    </div>
  )
}
