'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThreadCard } from '@/components/thread-card'
import { topByMetric, type Metric } from '@/lib/insights-stats'
import type { PostWithInsights } from '@/lib/threads-api'

interface TopPostsProps {
  posts: PostWithInsights[]
}

const TAB_VALUES: ReadonlyArray<Metric> = ['views', 'likes', 'replies']

export function TopPosts({ posts }: TopPostsProps) {
  const t = useTranslations('insights')
  const [metric, setMetric] = useState<Metric>('views')

  const top = useMemo(() => topByMetric(posts, metric, 10), [posts, metric])

  const metricLabel = (m: Metric): string => {
    switch (m) {
      case 'views':
        return t('metricViews')
      case 'likes':
        return t('metricLikes')
      case 'replies':
        return t('metricReplies')
      case 'reposts':
        return t('metricReposts')
      case 'quotes':
        return t('metricQuotes')
    }
  }

  return (
    <section className="border-t border-border">
      <div className="px-4 py-4 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-base">{t('topPostsHeading')}</h2>
        <Tabs
          value={metric}
          onValueChange={(v) => setMetric(String(v) as Metric)}
        >
          <TabsList>
            {TAB_VALUES.map((value) => (
              <TabsTrigger key={value} value={value}>
                {metricLabel(value)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {top.length === 0 ? (
        <p className="px-4 pb-6 text-sm text-muted-foreground">
          {t('noPostsToShow')}
        </p>
      ) : (
        <ol>
          {top.map((post, idx) => (
            <li key={post.id} className="flex items-stretch">
              <div className="flex flex-col items-center justify-center w-10 shrink-0 border-b border-border">
                <span
                  className={`text-sm font-bold ${
                    idx < 3 ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <ThreadCard post={post} showInsights />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
