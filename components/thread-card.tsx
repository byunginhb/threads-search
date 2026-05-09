'use client'

import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Eye, Heart, MessageCircle, Repeat2, Quote, ExternalLink } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatNumber } from '@/lib/format'
import type { ThreadPost, MediaInsights } from '@/lib/threads-api'

interface ThreadCardProps {
  post: ThreadPost & { insights?: MediaInsights }
  showInsights?: boolean
}

export function ThreadCard({ post, showInsights = false }: ThreadCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true, locale: ko })

  return (
    <article
      className="flex gap-3 px-4 py-4 border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
      onClick={() => window.open(post.permalink, '_blank', 'noopener,noreferrer')}
    >
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="text-sm font-medium bg-muted">
          {post.username?.[0]?.toUpperCase() ?? '?'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[15px] font-semibold text-foreground truncate">
            @{post.username}
          </span>
          <span className="text-[13px] text-muted-foreground shrink-0">{timeAgo}</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
        </div>

        <p className="text-[15px] leading-[22px] text-foreground line-clamp-3 break-words">
          {post.text}
        </p>

        {showInsights && post.insights && (
          <div className="flex items-center gap-4 mt-3 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {formatNumber(post.insights.views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {formatNumber(post.insights.likes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {formatNumber(post.insights.replies)}
            </span>
            <span className="flex items-center gap-1">
              <Repeat2 className="h-4 w-4" />
              {formatNumber(post.insights.reposts)}
            </span>
            <span className="flex items-center gap-1">
              <Quote className="h-4 w-4" />
              {formatNumber(post.insights.quotes)}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
