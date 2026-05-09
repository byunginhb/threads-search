import Link from 'next/link'
import { cookies } from 'next/headers'
import { Search, BarChart2, ArrowRight, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function HomePage() {
  const cookieStore = await cookies()
  const isAuthenticated = Boolean(cookieStore.get('threads_token')?.value)
  const username = cookieStore.get('threads_username')?.value ?? ''
  const displayName = cookieStore.get('threads_name')?.value ?? ''
  const profilePic = cookieStore.get('threads_profile_pic')?.value ?? ''

  return (
    <main className="max-w-[620px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Threads Search</h1>
        <p className="text-muted-foreground text-[16px] leading-relaxed">
          내 Threads 게시물을 검색하고<br />
          상세 인사이트를 한눈에 확인하세요.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          href="/search"
          className={cn(buttonVariants(), 'flex-1 gap-2 rounded-full')}
        >
          <Search className="h-4 w-4" />
          게시물 검색
        </Link>
        <Link
          href="/insights"
          className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 gap-2 rounded-full')}
        >
          <BarChart2 className="h-4 w-4" />
          내 인사이트
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
        <div className="border border-border rounded-xl p-5 text-left space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Search className="h-5 w-5" />
            내 게시물 검색
          </div>
          <p className="text-sm text-muted-foreground">
            내가 작성한 Threads 게시물을 텍스트로 빠르게 찾아 원문으로 이동합니다.
          </p>
        </div>
        <div className="border border-border rounded-xl p-5 text-left space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <BarChart2 className="h-5 w-5" />
            인사이트 대시보드
          </div>
          <p className="text-sm text-muted-foreground">
            조회수·좋아요·댓글 통계와 미디어/요일/시간대별 패턴을 그래프로 확인합니다.
          </p>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-muted/30">
            <Avatar className="h-8 w-8">
              {profilePic && <AvatarImage src={profilePic} alt={username || 'avatar'} />}
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
              로그아웃
            </button>
          </form>
        </div>
      ) : (
        <Link
          href="/auth"
          className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2 text-muted-foreground')}
        >
          Threads 계정 연결 <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </main>
  )
}
