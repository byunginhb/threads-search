'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/format'
import type { MediaTypeGroup } from '@/lib/insights-stats'
import type { MediaType } from '@/lib/threads-api'

interface MediaTypeChartProps {
  groups: MediaTypeGroup[]
}

// shadcn 토큰 기반의 차분한 팔레트
const COLORS = [
  'hsl(var(--chart-1, 220 70% 50%))',
  'hsl(var(--chart-2, 150 60% 45%))',
  'hsl(var(--chart-3, 30 80% 55%))',
  'hsl(var(--chart-4, 280 60% 55%))',
]

const FALLBACK_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7']

const KNOWN_TYPES: ReadonlyArray<MediaType> = [
  'TEXT',
  'IMAGE',
  'VIDEO',
  'CAROUSEL_ALBUM',
]

function isKnownType(value: string): value is MediaType {
  return (KNOWN_TYPES as readonly string[]).includes(value)
}

export function MediaTypeChart({ groups }: MediaTypeChartProps) {
  const t = useTranslations('insights.charts')
  const tType = useTranslations('insights.mediaType')

  const total = groups.reduce((sum, g) => sum + g.count, 0)
  const data = groups.map((g) => ({
    name: isKnownType(g.type) ? tType(g.type) : g.type,
    value: g.count,
    avgViews: g.avgViews,
  }))

  return (
    <Card>
      <CardContent className="space-y-3">
        <h3 className="font-semibold text-base">{t('mediaTypeTitle')}</h3>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noData')}</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-1/2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {data.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={
                          COLORS[idx % COLORS.length] ||
                          FALLBACK_COLORS[idx % FALLBACK_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))',
                    }}
                    formatter={(v) => {
                      const numeric =
                        typeof v === 'number' ? v : Number(v) || 0
                      return [
                        t('postsCountUnit', { count: numeric }),
                        t('postsLabel'),
                      ]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 w-full space-y-2 text-sm">
              {data.map((d, idx) => (
                <li
                  key={d.name}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      aria-hidden
                      className="h-3 w-3 rounded-sm shrink-0"
                      style={{
                        backgroundColor:
                          FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
                      }}
                    />
                    <span className="truncate">{d.name}</span>
                    <span className="text-muted-foreground shrink-0">
                      ({d.value})
                    </span>
                  </span>
                  <span className="text-muted-foreground shrink-0">
                    {t('avgViewsCount', { value: formatNumber(d.avgViews) })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
