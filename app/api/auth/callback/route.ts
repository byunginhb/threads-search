import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const LOG_PREFIX = '[auth-callback]'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  console.log(`${LOG_PREFIX} start`, { hasCode: Boolean(code), error })

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth?error=${error ?? 'no_code'}`
    )
  }

  const appId = process.env.THREADS_APP_ID!
  const appSecret = process.env.THREADS_APP_SECRET!
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const redirectUri = `${appUrl}/api/auth/callback`

  // Step 1: short-lived token
  const tokenForm = new URLSearchParams()
  tokenForm.set('client_id', appId)
  tokenForm.set('client_secret', appSecret)
  tokenForm.set('grant_type', 'authorization_code')
  tokenForm.set('redirect_uri', redirectUri)
  tokenForm.set('code', code)

  const tokenRes = await fetch(
    'https://graph.threads.net/oauth/access_token',
    {
      method: 'POST',
      body: tokenForm,
    }
  )
  const tokenBody = await tokenRes.text()
  console.log(`${LOG_PREFIX} short-lived token response`, {
    status: tokenRes.status,
    body: tokenBody,
  })

  let tokenData: {
    access_token?: string
    user_id?: string
    permissions?: string[]
    error?: { message: string }
  } = {}
  try {
    tokenData = JSON.parse(tokenBody)
  } catch {
    return NextResponse.redirect(`${appUrl}/auth?error=parse_error`)
  }

  if (!tokenData.access_token || !tokenData.user_id) {
    return NextResponse.redirect(`${appUrl}/auth?error=token_exchange_failed`)
  }

  console.log(`${LOG_PREFIX} short-lived granted permissions`, tokenData.permissions)

  // Step 2: long-lived token
  const longTokenUrl = new URL('https://graph.threads.net/access_token')
  longTokenUrl.searchParams.set('grant_type', 'th_exchange_token')
  longTokenUrl.searchParams.set('client_secret', appSecret)
  longTokenUrl.searchParams.set('access_token', tokenData.access_token)

  const longTokenRes = await fetch(longTokenUrl.toString())
  const longTokenBody = await longTokenRes.text()
  console.log(`${LOG_PREFIX} long-lived token response`, {
    status: longTokenRes.status,
    body: longTokenBody,
  })

  let longTokenData: { access_token?: string } = {}
  try {
    longTokenData = JSON.parse(longTokenBody)
  } catch {
    /* ignore */
  }

  const finalToken = longTokenData.access_token ?? tokenData.access_token

  // 프로필 정보(username, name, profile picture)를 가져와 쿠키에 저장한다.
  // 홈 페이지에서 매번 API 호출 없이 표시할 수 있게 하기 위함.
  let username = ''
  let displayName = ''
  let profilePictureUrl = ''
  try {
    const meUrl = new URL('https://graph.threads.net/v1.0/me')
    meUrl.searchParams.set('fields', 'username,name,threads_profile_picture_url')
    meUrl.searchParams.set('access_token', finalToken)
    const meRes = await fetch(meUrl.toString(), { cache: 'no-store' })
    if (meRes.ok) {
      const meData = (await meRes.json()) as {
        username?: string
        name?: string
        threads_profile_picture_url?: string
      }
      username = meData.username ?? ''
      displayName = meData.name ?? ''
      profilePictureUrl = meData.threads_profile_picture_url ?? ''
      console.log(`${LOG_PREFIX} profile fetched`, { username, displayName })
    } else {
      console.warn(`${LOG_PREFIX} profile fetch failed`, meRes.status)
    }
  } catch (e) {
    console.warn(`${LOG_PREFIX} profile fetch error`, e)
  }

  const cookieStore = await cookies()
  const SIXTY_DAYS = 60 * 24 * 60 * 60
  const baseCookie = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SIXTY_DAYS,
    path: '/',
  }
  cookieStore.set('threads_token', finalToken, { ...baseCookie, httpOnly: true })
  cookieStore.set('threads_user_id', String(tokenData.user_id), {
    ...baseCookie,
    httpOnly: false,
  })
  if (username) {
    cookieStore.set('threads_username', username, { ...baseCookie, httpOnly: false })
  }
  if (displayName) {
    cookieStore.set('threads_name', displayName, { ...baseCookie, httpOnly: false })
  }
  if (profilePictureUrl) {
    cookieStore.set('threads_profile_pic', profilePictureUrl, {
      ...baseCookie,
      httpOnly: false,
    })
  }

  console.log(`${LOG_PREFIX} done — cookies set, redirecting`)

  return NextResponse.redirect(`${appUrl}/insights`)
}
