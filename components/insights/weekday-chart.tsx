'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import type { WeekdayGroup } from '@/lib/insights-stats'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

interface WeekdayChartProps {
  groups: WeekdayGroup[]
}

export function WeekdayChart({ groups }: WeekdayChartProps) {
  const data = groups.map((g) => ({
    weekday: WEEKDAY_LABELS[g.weekday],
    count: g.count,
    avgViews: g.avgViews,
  }))

  return (
    <Card>
      <CardContent className="space-y-3">
        <h3 className="font-semibold text-base">요일별 게시 패턴</h3>
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="weekday" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(v) =>
                  v === 'count' ? '게시 횟수' : '평균 조회수'
                }
              />
              <Bar
                yAxisId="left"
                dataKey="count"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgViews"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
