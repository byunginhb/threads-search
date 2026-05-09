'use client'

import { useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThreadCard } from '@/components/thread-card'
import { topByMetric, type Metric } from '@/lib/insights-stats'
import type { PostWithInsights } from '@/lib/threads-api'

interface TopPostsProps {
  posts: PostWithInsights[]
}

const TABS: Array<{ value: Metric; label: string }> = [
  { value: 'views', label: '조회수' },
  { value: 'likes', label: '좋아요' },
  { value: 'replies', label: '댓글' },
]

export function TopPosts({ posts }: TopPostsProps) {
  const [metric, setMetric] = useState<Metric>('views')

  const top = useMemo(() => topByMetric(posts, metric, 10), [posts, metric])

  return (
    <section className="border-t border-border">
      <div className="px-4 py-4 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-base">Top 10</h2>
        <Tabs
          value={metric}
          onValueChange={(v) => setMetric(String(v) as Metric)}
        >
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {top.length === 0 ? (
        <p className="px-4 pb-6 text-sm text-muted-foreground">
          표시할 게시물이 없습니다.
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
