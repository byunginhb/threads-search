import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/language-switcher'

export async function Footer() {
  const t = await getTranslations('footer')

  const links = [
    { href: '/privacy', label: t('privacy') },
    { href: '/terms', label: t('terms') },
    { href: '/data-deletion', label: t('dataDeletion') },
  ] as const

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[860px] mx-auto px-4 py-8 flex flex-col items-center gap-3 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher />
        <p className="text-xs text-muted-foreground">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
