import { setRequestLocale, getTranslations } from 'next-intl/server'
import { ExternalLink, KeyRound, BarChart3, ShieldAlert } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AuthPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function AuthPage({
  params,
  searchParams,
}: AuthPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('auth')

  const sp = await searchParams
  const errorCode = sp.error

  return (
    <main className="max-w-[620px] mx-auto px-4 py-12 flex flex-col items-center text-center gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {errorCode ? (
        <div className="w-full max-w-md flex items-start gap-2 px-4 py-3 rounded-lg border border-destructive/40 bg-destructive/5 text-left text-sm">
          <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
          <span className="text-destructive">
            <strong>{t('errorBadge')}: </strong>
            {errorCode}
          </span>
        </div>
      ) : null}

      <section className="w-full max-w-md border border-border rounded-xl p-5 space-y-4 text-left">
        <h2 className="font-semibold text-base">{t('permissionsHeading')}</h2>
        <ul className="space-y-4 text-sm">
          <li className="flex gap-3">
            <KeyRound className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                {t('permissionBasic.title')}
              </div>
              <p className="text-muted-foreground">
                {t('permissionBasic.description')}
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <BarChart3 className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                {t('permissionInsights.title')}
              </div>
              <p className="text-muted-foreground">
                {t('permissionInsights.description')}
              </p>
            </div>
          </li>
        </ul>
        <p className="text-xs text-muted-foreground border-t border-border pt-3">
          {t('noPostingNotice')}
        </p>
      </section>

      <section className="w-full max-w-md border border-border rounded-xl p-5 space-y-2 text-left bg-muted/30">
        <h3 className="font-semibold text-sm">{t('dataHandlingHeading')}</h3>
        <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-5">
          <li>{t('dataHandling1')}</li>
          <li>{t('dataHandling2')}</li>
          <li>{t('dataHandling3')}</li>
        </ul>
        <p className="text-xs text-muted-foreground pt-2">
          {renderPolicyLinks(
            t('policyLinks'),
            t('privacyLink'),
            t('termsLink')
          )}
        </p>
      </section>

      {/* /api/auth 는 페이지가 아닌 OAuth 시작용 API route 이므로 Link 가 아닌 a 태그 사용. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/api/auth"
        className={cn(
          buttonVariants({ size: 'lg' }),
          'rounded-full px-8 gap-2'
        )}
      >
        <ExternalLink className="h-4 w-4" />
        {t('loginButton')}
      </a>

      <p className="text-xs text-muted-foreground max-w-xs">
        {t('metaDisclaimer')}
      </p>
    </main>
  )
}

/**
 * "{privacy}" 와 "{terms}" placeholder 를 각각 링크로 치환한다.
 * Server Component 에서 t.rich 가 직렬화 문제를 일으키므로 평문 split 방식 사용.
 */
function renderPolicyLinks(
  template: string,
  privacyLabel: string,
  termsLabel: string
): React.ReactNode {
  const parts = template.split(/(\{privacy\}|\{terms\})/g)
  return parts.map((part, i) => {
    if (part === '{privacy}') {
      return (
        <Link key={i} href="/privacy" className="underline">
          {privacyLabel}
        </Link>
      )
    }
    if (part === '{terms}') {
      return (
        <Link key={i} href="/terms" className="underline">
          {termsLabel}
        </Link>
      )
    }
    return <span key={i}>{part}</span>
  })
}
