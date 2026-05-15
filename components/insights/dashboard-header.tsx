'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  postCount: number
  excludeReplies: boolean
}

export function DashboardHeader({
  postCount,
  excludeReplies,
}: DashboardHeaderProps) {
  const t = useTranslations('insights')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleToggleReplies = () => {
    const next = excludeReplies ? 'false' : 'true'
    const params = new URLSearchParams(searchParams.toString())
    params.set('excludeReplies', next)
    const url = `${pathname}?${params.toString()}`
    startTransition(() => {
      router.push(url)
    })
  }

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="px-4 py-4 border-b border-border flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold">{t('headerTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('headerSubtitle', {
            count: postCount,
            repliesLabel: excludeReplies
              ? t('repliesExcluded')
              : t('repliesIncluded'),
          })}
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
          <span>{t('toggleReplies')}</span>
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
          aria-label={t('refreshLabel')}
        >
          <RefreshCw
            className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`}
          />
        </Button>
      </div>
    </div>
  )
}
