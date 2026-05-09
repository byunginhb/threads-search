'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  postCount: number
  excludeReplies: boolean
}

const LOG_PREFIX = '[dashboard-header]'

export function DashboardHeader({
  postCount,
  excludeReplies,
}: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleToggleReplies = () => {
    const next = excludeReplies ? 'false' : 'true'
    const params = new URLSearchParams(searchParams.toString())
    params.set('excludeReplies', next)
    const url = `${pathname}?${params.toString()}`
    console.log(`${LOG_PREFIX} toggle replies`, { next, url })
    startTransition(() => {
      router.push(url)
    })
  }

  const handleRefresh = () => {
    console.log(`${LOG_PREFIX} refresh clicked`)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="px-4 py-4 border-b border-border flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold">내 인사이트</h1>
        <p className="text-sm text-muted-foreground mt-1">
          게시물 {postCount}개 · {excludeReplies ? '답글 제외' : '답글 포함'}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          role="switch"
          aria-checked={!excludeReplies}
          onClick={handleToggleReplies}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>답글 포함</span>
          <span
            className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${
              !excludeReplies ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${
                !excludeReplies ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </span>
        </button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleRefresh}
          disabled={isPending}
          aria-label="새로고침"
        >
          <RefreshCw
            className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`}
          />
        </Button>
      </div>
    </div>
  )
}
