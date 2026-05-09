'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/search', icon: Search, label: '검색' },
  { href: '/insights', icon: BarChart2, label: '인사이트' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <>
      {/* PC: 좌측 사이드바 */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[72px] lg:w-[245px] border-r border-border flex-col bg-background z-50">
        <div className="px-3 py-5 lg:px-6">
          <span className="hidden lg:block text-xl font-bold text-foreground">Threads Search</span>
          <span className="lg:hidden text-xl font-bold text-foreground">TS</span>
        </div>
        <div className="flex flex-col gap-1 px-2 lg:px-3 flex-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-4 px-3 py-3 rounded-xl text-[16px] transition-colors',
                  isActive
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="h-[26px] w-[26px] shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden lg:block">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* 모바일: 하단 탭바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background z-50 flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px]">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
