/**
 * 게시물 + 인사이트 배열을 받아서 통계를 계산하는 순수 함수 모음.
 * 모든 함수는 입력을 변경하지 않고 새 객체/배열을 반환한다.
 */

import type {
  PostWithInsights,
  MediaInsights,
  MediaType,
} from '@/lib/threads-api'
import { logServer } from '@/lib/log'

const LOG_PREFIX = '[insights-stats]'

export interface Totals extends MediaInsights {
  count: number
}

export interface Averages {
  avgViews: number
  avgLikes: number
  avgReplies: number
  avgReposts: number
  avgQuotes: number
}

export type Metric = 'views' | 'likes' | 'replies' | 'reposts' | 'quotes'

export interface MediaTypeGroup {
  type: MediaType
  count: number
  avgViews: number
}

export interface WeekdayGroup {
  weekday: number // 0=일, 1=월, ... 6=토
  count: number
  avgViews: number
}

export interface HourGroup {
  hour: number // 0~23
  count: number
  avgViews: number
}

export function computeTotals(posts: PostWithInsights[]): Totals {
  const result = posts.reduce<Totals>(
    (acc, post) => ({
      views: acc.views + post.insights.views,
      likes: acc.likes + post.insights.likes,
      replies: acc.replies + post.insights.replies,
      reposts: acc.reposts + post.insights.reposts,
      quotes: acc.quotes + post.insights.quotes,
      count: acc.count + 1,
    }),
    { views: 0, likes: 0, replies: 0, reposts: 0, quotes: 0, count: 0 }
  )
  logServer.debug(`${LOG_PREFIX} computeTotals`, {
    inputLen: posts.length,
    out: result,
  })
  return result
}

export function computeAverages(posts: PostWithInsights[]): Averages {
  if (posts.length === 0) {
    const empty = {
      avgViews: 0,
      avgLikes: 0,
      avgReplies: 0,
      avgReposts: 0,
      avgQuotes: 0,
    }
    logServer.debug(`${LOG_PREFIX} computeAverages empty`, { inputLen: 0 })
    return empty
  }
  const totals = computeTotals(posts)
  const n = totals.count
  const result: Averages = {
    avgViews: Math.round(totals.views / n),
    avgLikes: Math.round(totals.likes / n),
    avgReplies: Math.round(totals.replies / n),
    avgReposts: Math.round(totals.reposts / n),
    avgQuotes: Math.round(totals.quotes / n),
  }
  logServer.debug(`${LOG_PREFIX} computeAverages`, {
    inputLen: posts.length,
    out: result,
  })
  return result
}

export function topByMetric(
  posts: PostWithInsights[],
  metric: Metric,
  n: number = 10
): PostWithInsights[] {
  const sorted = [...posts].sort(
    (a, b) => b.insights[metric] - a.insights[metric]
  )
  const result = sorted.slice(0, n)
  logServer.debug(`${LOG_PREFIX} topByMetric`, {
    inputLen: posts.length,
    metric,
    n,
    outLen: result.length,
    topValue: result[0]?.insights[metric] ?? 0,
  })
  return result
}

export function groupByMediaType(
  posts: PostWithInsights[]
): MediaTypeGroup[] {
  const buckets = new Map<MediaType, { count: number; views: number }>()
  for (const post of posts) {
    const prev = buckets.get(post.media_type) ?? { count: 0, views: 0 }
    buckets.set(post.media_type, {
      count: prev.count + 1,
      views: prev.views + post.insights.views,
    })
  }
  const result: MediaTypeGroup[] = Array.from(buckets.entries()).map(
    ([type, { count, views }]) => ({
      type,
      count,
      avgViews: count > 0 ? Math.round(views / count) : 0,
    })
  )
  logServer.debug(`${LOG_PREFIX} groupByMediaType`, {
    inputLen: posts.length,
    out: result,
  })
  return result
}

export function groupByWeekday(posts: PostWithInsights[]): WeekdayGroup[] {
  const buckets = new Array(7)
    .fill(null)
    .map(() => ({ count: 0, views: 0 }))
  for (const post of posts) {
    const d = new Date(post.timestamp)
    if (Number.isNaN(d.getTime())) continue
    const wd = d.getDay()
    buckets[wd] = {
      count: buckets[wd].count + 1,
      views: buckets[wd].views + post.insights.views,
    }
  }
  const result: WeekdayGroup[] = buckets.map((b, i) => ({
    weekday: i,
    count: b.count,
    avgViews: b.count > 0 ? Math.round(b.views / b.count) : 0,
  }))
  logServer.debug(`${LOG_PREFIX} groupByWeekday`, {
    inputLen: posts.length,
    counts: result.map((r) => r.count),
  })
  return result
}

export function groupByHour(posts: PostWithInsights[]): HourGroup[] {
  const buckets = new Array(24)
    .fill(null)
    .map(() => ({ count: 0, views: 0 }))
  for (const post of posts) {
    const d = new Date(post.timestamp)
    if (Number.isNaN(d.getTime())) continue
    const hr = d.getHours()
    buckets[hr] = {
      count: buckets[hr].count + 1,
      views: buckets[hr].views + post.insights.views,
    }
  }
  const result: HourGroup[] = buckets.map((b, i) => ({
    hour: i,
    count: b.count,
    avgViews: b.count > 0 ? Math.round(b.views / b.count) : 0,
  }))
  logServer.debug(`${LOG_PREFIX} groupByHour`, {
    inputLen: posts.length,
    nonZeroHours: result.filter((r) => r.count > 0).length,
  })
  return result
}
