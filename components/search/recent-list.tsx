import { FileText } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
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
  accessToken: string,
  fallbackError: string
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
      message: error instanceof Error ? error.message : fallbackError,
    }
  }
}

export async function RecentList({ userId, accessToken }: RecentListProps) {
  const t = await getTranslations('search')
  const tCommon = await getTranslations('common')

  const result = await loadRecent(userId, accessToken, t('loadError'))

  if (result.kind === 'error') {
    return (
      <EmptyState title={tCommon('error')} description={result.message} />
    )
  }

  if (result.posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-10 w-10" />}
        title={t('noPostsTitle')}
        description={t('noPostsDescription')}
      />
    )
  }

  return (
    <div>
      <p className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
        {t('recentCountLabel', { count: result.posts.length })}
      </p>
      {result.posts.map((post) => (
        <ThreadCard key={post.id} post={post} />
      ))}
    </div>
  )
}
