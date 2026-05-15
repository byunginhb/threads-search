'use client'

import {
  FileText,
  Eye,
  TrendingUp,
  Heart,
  MessageCircle,
  Repeat2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/format'
import type { Totals, Averages } from '@/lib/insights-stats'

interface SummaryCardsProps {
  totals: Totals
  averages: Averages
}

type SummaryKey =
  | 'postCount'
  | 'totalViews'
  | 'avgViews'
  | 'totalLikes'
  | 'totalReplies'
  | 'totalReposts'

interface Item {
  icon: LucideIcon
  key: SummaryKey
  value: number
}

export function SummaryCards({ totals, averages }: SummaryCardsProps) {
  const t = useTranslations('insights.summary')

  const items: Item[] = [
    { icon: FileText, key: 'postCount', value: totals.count },
    { icon: Eye, key: 'totalViews', value: totals.views },
    { icon: TrendingUp, key: 'avgViews', value: averages.avgViews },
    { icon: Heart, key: 'totalLikes', value: totals.likes },
    { icon: MessageCircle, key: 'totalReplies', value: totals.replies },
    { icon: Repeat2, key: 'totalReposts', value: totals.reposts },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 py-4">
      {items.map(({ icon: Icon, key, value }) => (
        <Card key={key} size="sm">
          <CardContent className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-xs">{t(key)}</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(value)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
