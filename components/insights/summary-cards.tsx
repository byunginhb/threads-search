import {
  FileText,
  Eye,
  TrendingUp,
  Heart,
  MessageCircle,
  Repeat2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/format'
import type { Totals, Averages } from '@/lib/insights-stats'

interface SummaryCardsProps {
  totals: Totals
  averages: Averages
}

interface Item {
  icon: LucideIcon
  label: string
  value: number
}

export function SummaryCards({ totals, averages }: SummaryCardsProps) {
  const items: Item[] = [
    { icon: FileText, label: '게시물 수', value: totals.count },
    { icon: Eye, label: '총 조회수', value: totals.views },
    { icon: TrendingUp, label: '평균 조회수', value: averages.avgViews },
    { icon: Heart, label: '총 좋아요', value: totals.likes },
    { icon: MessageCircle, label: '총 댓글', value: totals.replies },
    { icon: Repeat2, label: '총 리포스트', value: totals.reposts },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 py-4">
      {items.map(({ icon: Icon, label, value }) => (
        <Card key={label} size="sm">
          <CardContent className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(value)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
