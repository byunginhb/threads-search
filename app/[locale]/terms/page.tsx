import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms' })
  const tMeta = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: `${t('title')} · ${tMeta('appName')}`,
  }
}

const SECTIONS: ReadonlyArray<{
  title: string
  body?: string
  items?: ReadonlyArray<string>
}> = [
  { title: 's1Title', body: 's1Body' },
  { title: 's2Title', body: 's2Body' },
  { title: 's3Title', items: ['s3Item1', 's3Item2', 's3Item3'] },
  { title: 's4Title', items: ['s4Item1', 's4Item2', 's4Item3'] },
  { title: 's5Title', items: ['s5Item1', 's5Item2', 's5Item3'] },
  { title: 's6Title', body: 's6Body' },
  { title: 's7Title', body: 's7Body' },
  { title: 's8Title', body: 's8Body' },
]

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('terms')

  return (
    <main className="max-w-[760px] mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('effectiveDate')}</p>
      </header>

      {SECTIONS.map(({ title, body, items }) => (
        <section key={title} className="space-y-3">
          <h2 className="text-xl font-semibold">{t(title)}</h2>
          {body ? (
            <p className="text-foreground leading-relaxed">{t(body)}</p>
          ) : null}
          {items ? (
            <ul className="list-disc pl-6 space-y-1">
              {items.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('s9Title')}</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>{t('s9Operator')}</li>
          <li>
            {t('s9Email')}{' '}
            <a
              href="mailto:ssomething.maker@gmail.com"
              className="underline"
            >
              ssomething.maker@gmail.com
            </a>
          </li>
        </ul>
      </section>
    </main>
  )
}
