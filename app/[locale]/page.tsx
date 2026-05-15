import { cookies } from 'next/headers'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Search, BarChart2, ArrowRight, LogOut } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')

  const cookieStore = await cookies()
  const isAuthenticated = Boolean(cookieStore.get('threads_token')?.value)
  const username = cookieStore.get('threads_username')?.value ?? ''
  const displayName = cookieStore.get('threads_name')?.value ?? ''
  const profilePic = cookieStore.get('threads_profile_pic')?.value ?? ''

  return (
    <main className="max-w-[620px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo.png"
          alt=""
          width={96}
          height={96}
          priority
          className="h-20 w-20 rounded-2xl shadow-sm"
        />
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">
            {tCommon('appName')}
          </h1>
          <p className="text-muted-foreground text-[16px] leading-relaxed">
            {t('tagline1')}
            <br />
            {t('tagline2')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Link
          href="/search"
          className="group relative border border-border rounded-xl p-5 text-left space-y-2 transition-all hover:border-foreground hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 cursor-pointer"
        >
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('searchCardTitle')}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t('searchCardDescription')}
          </p>
        </Link>
        <Link
          href="/insights"
          className="group relative border border-border rounded-xl p-5 text-left space-y-2 transition-all hover:border-foreground hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 cursor-pointer"
        >
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              {t('insightsCardTitle')}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t('insightsCardDescription')}
          </p>
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-muted/30">
            <Avatar className="h-8 w-8">
              {profilePic && (
                <AvatarImage
                  src={profilePic}
                  alt={username || t('avatarAlt')}
                />
              )}
              <AvatarFallback className="text-xs font-medium">
                {(username || displayName || '?')[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left leading-tight">
              {displayName && (
                <div className="text-sm font-semibold text-foreground">
                  {displayName}
                </div>
              )}
              {username && (
                <div className="text-xs text-muted-foreground">@{username}</div>
              )}
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'gap-2 text-muted-foreground'
              )}
            >
              <LogOut className="h-4 w-4" />
              {tCommon('logout')}
            </button>
          </form>
        </div>
      ) : (
        <Link
          href="/auth"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'gap-2 text-muted-foreground'
          )}
        >
          {t('connect')} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </main>
  )
}
