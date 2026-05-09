import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileText, AlertCircle } from 'lucide-react'
import { DashboardHeader } from '@/components/insights/dashboard-header'
import { SummaryCards } from '@/components/insights/summary-cards'
import { TopPosts } from '@/components/insights/top-posts'
import { MediaTypeChart } from '@/components/insights/media-type-chart'
import { WeekdayChart } from '@/components/insights/weekday-chart'
import { HourChart } from '@/components/insights/hour-chart'
import { EmptyState } from '@/components/empty-state'
import { getCachedMyPostsWithInsights } from '@/lib/cache'
import {
  computeTotals,
  computeAverages,
  groupByMediaType,
  groupByWeekday,
  groupByHour,
} from '@/lib/insights-stats'

interface InsightsPageProps {
  searchParams: Promise<{ excludeReplies?: string }>
}

const LOG_PREFIX = '[insights-page]'

export default async function InsightsPage({
  searchParams,
}: InsightsPageProps) {
  const params = await searchParams
  const excludeReplies = (params.excludeReplies ?? 'true') !== 'false'

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('threads_token')?.value
  const userId = cookieStore.get('threads_user_id')?.value

  console.log(`${LOG_PREFIX} render`, {
    excludeReplies,
    hasToken: Boolean(accessToken),
    hasUserId: Boolean(userId),
  })

  if (!accessToken || !userId) {
    redirect('/auth')
  }

  let posts: Awaited<ReturnType<typeof getCachedMyPostsWithInsights>> = []
  let fetchError: string | null = null

  try {
    posts = await getCachedMyPostsWithInsights({
      userId,
      accessToken,
      excludeReplies,
    })
    console.log(`${LOG_PREFIX} fetched posts`, { count: posts.length })
  } catch (error) {
    fetchError =
      error instanceof Error ? error.message : '인사이트를 불러오지 못했습니다'
    console.error(`${LOG_PREFIX} fetch error`, fetchError)
  }

  if (fetchError) {
    return (
      <div className="max-w-[860px] mx-auto">
        <DashboardHeader postCount={0} excludeReplies={excludeReplies} />
        <EmptyState
          icon={<AlertCircle className="h-10 w-10" />}
          title="오류가 발생했습니다"
          description={fetchError}
        />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-[860px] mx-auto">
        <DashboardHeader postCount={0} excludeReplies={excludeReplies} />
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="게시물이 없습니다"
          description="Threads에 글을 작성하면 통계가 여기에 표시됩니다."
        />
      </div>
    )
  }

  const totals = computeTotals(posts)
  const averages = computeAverages(posts)
  const mediaGroups = groupByMediaType(posts)
  const weekdayGroups = groupByWeekday(posts)
  const hourGroups = groupByHour(posts)

  console.log(`${LOG_PREFIX} stats summary`, {
    totalPosts: totals.count,
    totalViews: totals.views,
    avgViews: averages.avgViews,
    mediaTypes: mediaGroups.length,
  })

  return (
    <div className="max-w-[860px] mx-auto pb-8">
      <DashboardHeader
        postCount={posts.length}
        excludeReplies={excludeReplies}
      />

      <SummaryCards totals={totals} averages={averages} />

      <div className="grid grid-cols-1 gap-3 px-4">
        <MediaTypeChart groups={mediaGroups} />
        <WeekdayChart groups={weekdayGroups} />
        <HourChart groups={hourGroups} />
      </div>

      <TopPosts posts={posts} />
    </div>
  )
}
