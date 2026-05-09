import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const THREADS_API_BASE = 'https://graph.threads.net/v1.0'

export async function GET() {
  // 프로덕션에서는 토큰/사용자 정보 노출 방지를 위해 차단
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('threads_token')?.value
  const userId = cookieStore.get('threads_user_id')?.value

  if (!accessToken || !userId) {
    return NextResponse.json(
      { ok: false, reason: 'no_token', hasToken: false, hasUserId: false },
      { status: 401 }
    )
  }

  // 1. /me 호출 — threads_basic 권한 검증
  const meUrl = new URL(`${THREADS_API_BASE}/me`)
  meUrl.searchParams.set('fields', 'id,username,name,threads_profile_picture_url')
  meUrl.searchParams.set('access_token', accessToken)

  const meRes = await fetch(meUrl.toString(), { cache: 'no-store' })
  const meBody = await meRes.text()
  let meParsed: unknown = null
  try {
    meParsed = JSON.parse(meBody)
  } catch {
    /* keep raw */
  }

  // 2. /me/threads 호출 — 동일 권한이지만 별도 액션
  const threadsUrl = new URL(`${THREADS_API_BASE}/me/threads`)
  threadsUrl.searchParams.set('fields', 'id')
  threadsUrl.searchParams.set('limit', '1')
  threadsUrl.searchParams.set('access_token', accessToken)

  const threadsRes = await fetch(threadsUrl.toString(), { cache: 'no-store' })
  const threadsBody = await threadsRes.text()
  let threadsParsed: unknown = null
  try {
    threadsParsed = JSON.parse(threadsBody)
  } catch {
    /* keep raw */
  }

  return NextResponse.json({
    ok: meRes.ok && threadsRes.ok,
    cookies: { hasToken: true, hasUserId: true, userIdFromCookie: userId },
    me: { status: meRes.status, body: meParsed ?? meBody },
    meThreads: { status: threadsRes.status, body: threadsParsed ?? threadsBody },
    hint:
      meRes.ok && !threadsRes.ok
        ? 'me works but me/threads fails — token has threads_basic identity but not posts access (rare)'
        : !meRes.ok
        ? 'me itself fails — token missing threads_basic entirely; re-authenticate'
        : 'all good',
  })
}
