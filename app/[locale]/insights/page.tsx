import { cookies } from 'next/headers'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { FileText, AlertCircle } from 'lucide-react'
import { redirect } from '@/i18n/navigation'
import { DashboardHeader } from '@/components/insights/dashboard-header'
import { SummaryCards } from '@/components/insights/summary-cards'
import { TopPosts } from '@/components/insights/top-posts'
import { MediaTypeChart } from '@/components/insights/media-type-chart'
import { WeekdayChart } from '@/components/insights/weekday-chart'
import { HourChart } from '@/components/insights/hour-chart'
import { EmptyState } from '@/components/empty-state'
import { getCachedMyPostsWithInsights } from '@/lib/cache'
import { logServer } from '@/lib/log'
import {
  computeTotals,
  computeAverages,
  groupByMediaType,
  groupByWeekday,
  groupByHour,
} from '@/lib/insights-stats'

interface InsightsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ excludeReplies?: string }>
}

const LOG_PREFIX = '[insights-page]'

export default async function InsightsPage({
  params,
  searchParams,
}: InsightsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('insights')
  const tCommon = await getTranslations('common')

  const sp = await searchParams
  const excludeReplies = (sp.excludeReplies ?? 'true') !== 'false'

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('threads_token')?.value
  const userId = cookieStore.get('threads_user_id')?.value

  logServer.debug(`${LOG_PREFIX} render`, {
    excludeReplies,
    hasToken: Boolean(accessToken),
    hasUserId: Boolean(userId),
  })

  if (!accessToken || !userId) {
    redirect({ href: '/auth', locale })
    return null
  }

  let posts: Awaited<ReturnType<typeof getCachedMyPostsWithInsights>> = []
  let fetchError: string | null = null

  try {
    posts = await getCachedMyPostsWithInsights({
      userId,
      accessToken,
      excludeReplies,
    })
    logServer.debug(`${LOG_PREFIX} fetched posts`, { count: posts.length })
  } catch (error) {
    fetchError =
      error instanceof Error ? error.message : t('fetchErrorFallback')
    logServer.error(`${LOG_PREFIX} fetch error`, fetchError)
  }

  if (fetchError) {
    return (
      <div className="max-w-[860px] mx-auto">
        <DashboardHeader postCount={0} excludeReplies={excludeReplies} />
        <EmptyState
          icon={<AlertCircle className="h-10 w-10" />}
          title={tCommon('error')}
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
          title={t('noPostsTitle')}
          description={t('noPostsDescription')}
        />
      </div>
    )
  }

  const totals = computeTotals(posts)
  const averages = computeAverages(posts)
  const mediaGroups = groupByMediaType(posts)
  const weekdayGroups = groupByWeekday(posts)
  const hourGroups = groupByHour(posts)

  logServer.debug(`${LOG_PREFIX} stats summary`, {
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
