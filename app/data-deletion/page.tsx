import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, LogOut, Settings, Trash2 } from 'lucide-react'

export const metadata: Metadata = {
  title: '데이터 삭제 안내 · Threads Search',
  description: 'Threads Search에서 본인 데이터를 삭제하는 방법',
}

export default function DataDeletionPage() {
  return (
    <main className="max-w-[760px] mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">데이터 삭제 안내</h1>
        <p className="text-muted-foreground">
          Threads Search는 사용자의 게시물·인사이트 데이터를 영구 저장하지 않습니다.
          아래 방법 중 어떤 것으로든 본 서비스 관련 데이터를 완전히 제거할 수 있습니다.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">방법 1 · 로그아웃 (즉시)</h2>
        <div className="border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <LogOut className="h-5 w-5" />
            홈 화면의 &ldquo;로그아웃&rdquo; 버튼
          </div>
          <p className="text-sm text-muted-foreground">
            로그아웃 시 액세스 토큰·사용자 식별 정보·프로필 정보가 담긴 쿠키 5종이
            브라우저에서 즉시 삭제됩니다. 서버 측 캐시는 5분 내 자동 만료됩니다.
          </p>
          <Link
            href="/"
            className="inline-block text-sm underline text-foreground hover:opacity-80"
          >
            홈으로 이동
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">방법 2 · Threads에서 권한 회수</h2>
        <div className="border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <Settings className="h-5 w-5" />
            Threads 앱 → 설정 → 계정 → 웹사이트 권한
          </div>
          <p className="text-sm text-muted-foreground">
            Threads 측에서 본 서비스의 접근 권한을 영구적으로 회수할 수 있습니다.
            이 경우 본 서비스가 보유한 액세스 토큰은 즉시 무효화되어, 더 이상 어떤
            데이터에도 접근할 수 없게 됩니다.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">방법 3 · 이메일로 삭제 요청</h2>
        <div className="border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <Mail className="h-5 w-5" />
            <a href="mailto:ssomething.maker@gmail.com" className="underline">
              ssomething.maker@gmail.com
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            이메일 제목에 &ldquo;Threads Search 데이터 삭제 요청&rdquo;을 명시하고,
            본인 확인이 가능한 Threads 사용자명을 본문에 적어 보내주세요.
            영업일 기준 7일 이내에 응답하며, 30일 이내에 처리 완료합니다.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          참고 · 본 서비스가 저장하는 데이터
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>
            <strong>브라우저 쿠키</strong> · 로그아웃 시 즉시 삭제
          </li>
          <li>
            <strong>서버 인메모리 캐시</strong> · 5분 후 자동 만료, 영구 저장 없음
          </li>
          <li>
            <strong>데이터베이스 저장</strong> · 없음
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          별도 데이터베이스가 없기 때문에, 로그아웃 또는 Threads 권한 회수만으로도
          본 서비스가 보관하는 모든 정보가 실질적으로 제거됩니다. 자세한 내용은{' '}
          <Link href="/privacy" className="underline">
            개인정보처리방침
          </Link>
          을 참고하세요.
        </p>
      </section>
    </main>
  )
}
