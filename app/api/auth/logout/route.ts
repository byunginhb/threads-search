import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * 로그아웃: 반드시 POST 만 허용한다.
 * GET 으로 두면 Next.js Link prefetch / 브라우저 사전 페치 / 링크 프리뷰 등에서
 * 의도치 않게 호출되어 쿠키가 지워질 수 있다.
 */
export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('threads_token')
  cookieStore.delete('threads_user_id')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  return NextResponse.redirect(`${appUrl}/auth`, { status: 303 })
}
