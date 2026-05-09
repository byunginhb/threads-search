import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AuthPage() {
  return (
    <main className="max-w-[620px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Threads 계정 연결</h1>
        <p className="text-muted-foreground">
          인사이트 기능을 사용하려면 Threads 계정을 연결해야 합니다.
        </p>
      </div>

      <div className="border border-border rounded-xl p-6 w-full max-w-sm space-y-4 text-left">
        <h2 className="font-semibold">요청 권한</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>· 기본 프로필 정보 읽기</li>
          <li>· 내 게시물 목록 조회</li>
          <li>· 내 게시물 인사이트 조회</li>
        </ul>
      </div>

      <Link
        href="/api/auth"
        className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-8 gap-2')}
      >
        <ExternalLink className="h-4 w-4" />
        Threads로 로그인
      </Link>

      <p className="text-xs text-muted-foreground max-w-xs">
        로그인하면 Threads API를 통해 안전하게 인증됩니다. 게시물 작성 권한은 요청하지 않습니다.
      </p>
    </main>
  )
}
