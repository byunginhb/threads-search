'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageSwitcher() {
  const t = useTranslations('languageSwitcher')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as (typeof routing.locales)[number]
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <Globe className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">{t('label')}</span>
      <select
        aria-label={t('label')}
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className="bg-transparent border border-border rounded-md px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 cursor-pointer"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </label>
  )
}
