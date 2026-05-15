import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'

interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  const tMeta = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: `${t('title')} · ${tMeta('appName')}`,
  }
}

const RENDER_KEYS: ReadonlyArray<{
  type: 'paragraph' | 'list'
  title?: string
  body?: string
  lead?: string
  items?: ReadonlyArray<string>
  outro?: string
}> = [
  { type: 'paragraph', body: 'intro' },
  {
    type: 'list',
    title: 's1Title',
    lead: 's1Lead',
    items: ['s1Item1', 's1Item2', 's1Item3', 's1Item4', 's1Item5'],
    outro: 's1Note',
  },
  {
    type: 'list',
    title: 's2Title',
    items: ['s2Item1', 's2Item2', 's2Item3'],
  },
  {
    type: 'list',
    title: 's3Title',
    items: ['s3Item1', 's3Item2', 's3Item3'],
  },
  { type: 'paragraph', title: 's4Title', body: 's4Body' },
  {
    type: 'list',
    title: 's5Title',
    lead: 's5Lead',
    items: ['s5Item1', 's5Item2', 's5Item3'],
  },
  {
    type: 'list',
    title: 's6Title',
    lead: 's6Lead',
    items: ['s6Item1', 's6Item2', 's6Item3'],
    outro: 's6Note',
  },
  {
    type: 'list',
    title: 's7Title',
    items: ['s7Item1', 's7Item2', 's7Item3'],
  },
  { type: 'paragraph', title: 's8Title', body: 's8Body' },
]

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('privacy')

  return (
    <main className="max-w-[760px] mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('effectiveDate')}</p>
      </header>

      {RENDER_KEYS.map((section, idx) => (
        <section key={idx} className="space-y-3">
          {section.title ? (
            <h2 className="text-xl font-semibold">{t(section.title)}</h2>
          ) : null}
          {section.lead ? (
            <p className="text-foreground leading-relaxed">
              {t(section.lead)}
            </p>
          ) : null}
          {section.body ? (
            <p className="text-foreground leading-relaxed">
              {t(section.body)}
            </p>
          ) : null}
          {section.items ? (
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              {section.items.map((key) => (
                <li key={key}>{renderInline(t(key))}</li>
              ))}
            </ul>
          ) : null}
          {section.outro ? (
            <p className="text-muted-foreground text-sm">{t(section.outro)}</p>
          ) : null}
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('s9Title')}</h2>
        <p>{t('s9Lead')}</p>
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

/**
 * **bold** 와 `code` 마크업을 React 노드로 변환한다 (정책 본문 가독성용).
 */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>
    }
    return part
  })
}
