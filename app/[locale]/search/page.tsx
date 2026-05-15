import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { SearchBar } from '@/components/search/search-bar'
import { RecentList } from '@/components/search/recent-list'
import { MySearchResults } from '@/components/search/my-search-results'
import { PostsSkeleton } from '@/components/loading/posts-skeleton'
import { logServer } from '@/lib/log'

interface SearchPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

const LOG_PREFIX = '[search-page]'

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const sp = await searchParams
  const q = sp.q?.trim() ?? ''

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('threads_token')?.value
  const userId = cookieStore.get('threads_user_id')?.value

  logServer.debug(`${LOG_PREFIX} render`, {
    q,
    hasToken: Boolean(accessToken),
    hasUserId: Boolean(userId),
  })

  if (!accessToken || !userId) {
    redirect({ href: '/auth', locale })
    return null
  }

  return (
    <div className="max-w-[620px] mx-auto">
      <SearchBar defaultQuery={q} />
      <Suspense key={q || 'recent'} fallback={<PostsSkeleton count={8} />}>
        {q ? (
          <MySearchResults q={q} userId={userId} accessToken={accessToken} />
        ) : (
          <RecentList userId={userId} accessToken={accessToken} />
        )}
      </Suspense>
    </div>
  )
}
