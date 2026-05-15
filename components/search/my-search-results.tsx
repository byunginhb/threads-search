import { SearchX } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
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
  accessToken: string,
  fallbackError: string
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
      message: error instanceof Error ? error.message : fallbackError,
    }
  }
}

export async function MySearchResults({
  q,
  userId,
  accessToken,
}: MySearchResultsProps) {
  const t = await getTranslations('search')
  const tCommon = await getTranslations('common')

  const result = await loadMatched(q, userId, accessToken, t('searchError'))

  if (result.kind === 'error') {
    return (
      <EmptyState title={tCommon('error')} description={result.message} />
    )
  }

  if (result.matched.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-10 w-10" />}
        title={t('noMatchTitle')}
        description={t('noMatchDescription', { total: result.total })}
      />
    )
  }

  return (
    <div>
      <p className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
        {t('matchedCountLabel', {
          q,
          matched: result.matched.length,
          total: result.total,
        })}
      </p>
      {result.matched.map((post) => (
        <ThreadCard key={post.id} post={post} />
      ))}
    </div>
  )
}
