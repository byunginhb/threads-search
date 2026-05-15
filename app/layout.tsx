import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://threads-search-insight.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Threads Search · 내 게시물 검색과 인사이트',
    template: '%s · Threads Search',
  },
  description:
    '내가 작성한 Threads 게시물을 키워드로 검색하고, 조회수·좋아요·댓글·리포스트 인사이트를 한눈에 확인하세요.',
  applicationName: 'Threads Search',
  keywords: ['Threads', '인사이트', '게시물 분석', 'Threads 통계', '소셜 미디어 분석'],
  authors: [{ name: 'Threads-insight팀' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: APP_URL,
    siteName: 'Threads Search',
    title: 'Threads Search · 내 게시물 검색과 인사이트',
    description:
      '내가 작성한 Threads 게시물을 키워드로 검색하고, 인사이트를 한눈에 확인하세요.',
  },
  twitter: {
    card: 'summary',
    title: 'Threads Search · 내 게시물 검색과 인사이트',
    description:
      '내가 작성한 Threads 게시물을 키워드로 검색하고, 인사이트를 한눈에 확인하세요.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className={`${inter.className} min-h-full bg-background text-foreground`}>
        <NavBar />
        {/* PC: 사이드바 공간 보정 */}
        <div className="md:ml-[72px] lg:ml-[245px] pb-16 md:pb-0 min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
