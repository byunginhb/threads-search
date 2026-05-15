import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { routing } from '@/i18n/routing'

const inter = Inter({ subsets: ['latin'] })

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://threads-search-insight.vercel.app'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    return {}
  }
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: t('title'),
      template: `%s · ${t('appName')}`,
    },
    description: t('description'),
    applicationName: t('appName'),
    keywords: t('keywords').split(', '),
    authors: [{ name: 'Threads-insight Team' }],
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
      other: [
        {
          rel: 'icon',
          url: '/android-chrome-192x192.png',
          sizes: '192x192',
        },
        {
          rel: 'icon',
          url: '/android-chrome-512x512.png',
          sizes: '512x512',
        },
      ],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      type: 'website',
      locale: t('ogLocale'),
      url: APP_URL,
      siteName: t('appName'),
      title: t('title'),
      description: t('shortDescription'),
      images: [
        {
          url: '/logo.png',
          width: 1254,
          height: 1254,
          alt: t('appName'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('shortDescription'),
      images: ['/logo.png'],
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} className="h-full antialiased">
      <body
        className={`${inter.className} min-h-full bg-background text-foreground`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NavBar />
          <div className="md:ml-[72px] lg:ml-[245px] pb-16 md:pb-0 min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
