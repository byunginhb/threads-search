import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'

interface DeletionStatusPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ code?: string; id?: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'deletionStatus' })
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  }
}

export default async function DeletionStatusPage({
  params,
  searchParams,
}: DeletionStatusPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('deletionStatus')

  const sp = await searchParams
  const code = sp.code ?? sp.id ?? ''

  return (
    <main className="max-w-[640px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
      <div className="rounded-full bg-green-50 dark:bg-green-950/30 p-4">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {code ? (
        <div className="w-full max-w-md border border-border rounded-lg px-4 py-3 text-sm text-left bg-muted/30">
          <div className="text-xs text-muted-foreground mb-1">
            {t('confirmationLabel')}
          </div>
          <code className="font-mono text-xs break-all">{code}</code>
        </div>
      ) : null}

      <section className="w-full max-w-md text-left space-y-3 text-sm">
        <h2 className="font-semibold">{t('whatWasDeletedHeading')}</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>{t('item1')}</li>
          <li>{t('item2')}</li>
          <li>{t('item3')}</li>
        </ul>
      </section>

      <p className="text-xs text-muted-foreground max-w-md">
        {t('detailsFooter')}{' '}
        <Link href="/privacy" className="underline">
          {t('privacyLink')}
        </Link>
        .
      </p>

      <Link
        href="/"
        className="text-sm underline text-muted-foreground hover:text-foreground"
      >
        {t('backHome')}
      </Link>
    </main>
  )
}
