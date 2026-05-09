'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/format'
import type { HourGroup } from '@/lib/insights-stats'

interface HourChartProps {
  groups: HourGroup[]
}

const HIGHLIGHT_COLOR = '#f59e0b'
const BASE_COLOR = '#3b82f6'

export function HourChart({ groups }: HourChartProps) {
  const maxAvg = groups.reduce((m, g) => Math.max(m, g.avgViews), 0)
  const data = groups.map((g) => ({
    hour: `${g.hour}시`,
    avgViews: g.avgViews,
    count: g.count,
    isPeak: maxAvg > 0 && g.avgViews === maxAvg,
  }))

  return (
    <Card>
      <CardContent className="space-y-3">
        <h3 className="font-semibold text-base">시간대별 평균 조회수</h3>
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10 }}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => formatNumber(v)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                  fontSize: '12px',
                }}
                formatter={(value, _name, item) => {
                  const numeric =
                    typeof value === 'number' ? value : Number(value) || 0
                  const count =
                    (item?.payload as { count?: number } | undefined)?.count ??
                    0
                  return [
                    `${formatNumber(numeric)} (${count}개 게시물)`,
                    '평균 조회수',
                  ]
                }}
              />
              <Bar dataKey="avgViews" radius={[4, 4, 0, 0]}>
                {data.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.isPeak ? HIGHLIGHT_COLOR : BASE_COLOR}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
