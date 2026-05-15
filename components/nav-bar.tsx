'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Home, Search, BarChart2 } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, key: 'home' },
  { href: '/search', icon: Search, key: 'search' },
  { href: '/insights', icon: BarChart2, key: 'insights' },
] as const

export function NavBar() {
  const pathname = usePathname()
  const t = useTranslations('common')

  return (
    <>
      {/* PC: 좌측 사이드바 */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[72px] lg:w-[245px] border-r border-border flex-col bg-background z-50">
        <Link
          href="/"
          aria-label={t('appName')}
          className="px-3 py-5 lg:px-6 flex items-center gap-2"
        >
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            priority
            className="h-8 w-8 rounded-md shrink-0"
          />
          <span className="hidden lg:block text-lg font-bold text-foreground truncate">
            {t('appName')}
          </span>
        </Link>
        <div className="flex flex-col gap-1 px-2 lg:px-3 flex-1">
          {navItems.map(({ href, icon: Icon, key }) => {
            const isActive =
              pathname === href || (href !== '/' && pathname.startsWith(href))
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
                <Icon
                  className="h-[26px] w-[26px] shrink-0"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="hidden lg:block">{t(key)}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* 모바일: 하단 탭바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background z-50 flex">
        {navItems.map(({ href, icon: Icon, key }) => {
          const isActive =
            pathname === href || (href !== '/' && pathname.startsWith(href))
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
              <span className="text-[11px]">{t(key)}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
