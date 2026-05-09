import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { SearchBar } from '@/components/search/search-bar'
import { RecentList } from '@/components/search/recent-list'
import { MySearchResults } from '@/components/search/my-search-results'
import { PostsSkeleton } from '@/components/loading/posts-skeleton'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

const LOG_PREFIX = '[search-page]'

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const q = params.q?.trim() ?? ''

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('threads_token')?.value
  const userId = cookieStore.get('threads_user_id')?.value

  console.log(`${LOG_PREFIX} render`, {
    q,
    hasToken: Boolean(accessToken),
    hasUserId: Boolean(userId),
  })

  if (!accessToken || !userId) {
    redirect('/auth')
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
