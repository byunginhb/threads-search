import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/nav-bar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threads Search',
  description: 'Threads 게시물 검색 및 인사이트',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className={`${inter.className} min-h-full bg-background text-foreground`}>
        <NavBar />
        {/* PC: 사이드바 공간 보정 */}
        <div className="md:ml-[72px] lg:ml-[245px] pb-16 md:pb-0 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
