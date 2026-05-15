import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Mail, LogOut, Settings, Trash2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'

interface DataDeletionPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dataDeletion' })
  const tMeta = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: `${t('title')} · ${tMeta('appName')}`,
  }
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

/**
 * "{privacyLink}" placeholder 를 React 노드로 치환한다.
 * Server Component 에서 t.rich 가 직렬화 문제를 일으키므로 평문 split 방식 사용.
 */
function renderWithLink(
  template: string,
  linkLabel: string,
  renderLink: (label: string) => React.ReactNode
): React.ReactNode {
  const parts = template.split(/(\{privacyLink\})/g)
  return parts.map((part, i) => {
    if (part === '{privacyLink}') {
      return <span key={i}>{renderLink(linkLabel)}</span>
    }
    return <span key={i}>{part}</span>
  })
}

export default async function DataDeletionPage({
  params,
}: DataDeletionPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('dataDeletion')

  return (
    <main className="max-w-[760px] mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('m1Title')}</h2>
        <div className="border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <LogOut className="h-5 w-5" />
            {t('m1Heading')}
          </div>
          <p className="text-sm text-muted-foreground">{t('m1Body')}</p>
          <Link
            href="/"
            className="inline-block text-sm underline text-foreground hover:opacity-80"
          >
            {t('m1Link')}
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('m2Title')}</h2>
        <div className="border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <Settings className="h-5 w-5" />
            {t('m2Heading')}
          </div>
          <p className="text-sm text-muted-foreground">{t('m2Body')}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('m3Title')}</h2>
        <div className="border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <Mail className="h-5 w-5" />
            <a
              href="mailto:ssomething.maker@gmail.com"
              className="underline"
            >
              ssomething.maker@gmail.com
            </a>
          </div>
          <p className="text-sm text-muted-foreground">{t('m3Body')}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          {t('noteTitle')}
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>{renderInline(t('noteItem1'))}</li>
          <li>{renderInline(t('noteItem2'))}</li>
          <li>{renderInline(t('noteItem3'))}</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          {renderWithLink(t('noteOutro'), t('privacyLink'), (chunk) => (
            <Link href="/privacy" className="underline">
              {chunk}
            </Link>
          ))}
        </p>
      </section>
    </main>
  )
}
