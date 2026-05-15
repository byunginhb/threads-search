import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logServer, maskToken } from '@/lib/log'

const LOG_PREFIX = '[auth-callback]'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  logServer.debug(`${LOG_PREFIX} start`, { hasCode: Boolean(code), error })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  if (error || !code) {
    return NextResponse.redirect(
      `${appUrl}/auth?error=${error ?? 'no_code'}`
    )
  }

  const appId = process.env.THREADS_APP_ID
  const appSecret = process.env.THREADS_APP_SECRET
  if (!appId || !appSecret || !appUrl) {
    logServer.error(`${LOG_PREFIX} missing env vars`)
    return NextResponse.redirect(`${appUrl}/auth?error=server_misconfigured`)
  }

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
  // 민감 데이터: production 에서는 본문 절대 노출 금지.
  logServer.debug(`${LOG_PREFIX} short-lived token response`, {
    status: tokenRes.status,
    bodyLength: tokenBody.length,
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
    logServer.warn(`${LOG_PREFIX} short-lived token parse failed`, {
      status: tokenRes.status,
    })
    return NextResponse.redirect(`${appUrl}/auth?error=parse_error`)
  }

  if (!tokenData.access_token || !tokenData.user_id) {
    logServer.warn(`${LOG_PREFIX} token exchange failed`, {
      status: tokenRes.status,
      hasErrorMessage: Boolean(tokenData.error?.message),
    })
    return NextResponse.redirect(`${appUrl}/auth?error=token_exchange_failed`)
  }

  logServer.debug(`${LOG_PREFIX} short-lived granted permissions`, {
    permissions: tokenData.permissions,
  })

  // Step 2: long-lived token
  const longTokenUrl = new URL('https://graph.threads.net/access_token')
  longTokenUrl.searchParams.set('grant_type', 'th_exchange_token')
  longTokenUrl.searchParams.set('client_secret', appSecret)
  longTokenUrl.searchParams.set('access_token', tokenData.access_token)

  const longTokenRes = await fetch(longTokenUrl.toString())
  const longTokenBody = await longTokenRes.text()
  logServer.debug(`${LOG_PREFIX} long-lived token response`, {
    status: longTokenRes.status,
    bodyLength: longTokenBody.length,
  })

  let longTokenData: { access_token?: string } = {}
  try {
    longTokenData = JSON.parse(longTokenBody)
  } catch {
    /* ignore */
  }

  const finalToken = longTokenData.access_token ?? tokenData.access_token

  // 프로필 정보(username, name, profile picture) 가져오기
  let username = ''
  let displayName = ''
  let profilePictureUrl = ''
  try {
    const meUrl = new URL('https://graph.threads.net/v1.0/me')
    meUrl.searchParams.set(
      'fields',
      'username,name,threads_profile_picture_url'
    )
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
      logServer.info(`${LOG_PREFIX} profile fetched`, {
        hasUsername: Boolean(username),
        hasDisplayName: Boolean(displayName),
      })
    } else {
      logServer.warn(`${LOG_PREFIX} profile fetch failed`, {
        status: meRes.status,
      })
    }
  } catch (e) {
    logServer.warn(
      `${LOG_PREFIX} profile fetch error`,
      e instanceof Error ? e.message : 'unknown'
    )
  }

  const cookieStore = await cookies()
  const SIXTY_DAYS = 60 * 24 * 60 * 60
  const baseCookie = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SIXTY_DAYS,
    path: '/',
  }
  cookieStore.set('threads_token', finalToken, {
    ...baseCookie,
    httpOnly: true,
  })
  cookieStore.set('threads_user_id', String(tokenData.user_id), {
    ...baseCookie,
    httpOnly: false,
  })
  if (username) {
    cookieStore.set('threads_username', username, {
      ...baseCookie,
      httpOnly: false,
    })
  }
  if (displayName) {
    cookieStore.set('threads_name', displayName, {
      ...baseCookie,
      httpOnly: false,
    })
  }
  if (profilePictureUrl) {
    cookieStore.set('threads_profile_pic', profilePictureUrl, {
      ...baseCookie,
      httpOnly: false,
    })
  }

  logServer.info(`${LOG_PREFIX} done — cookies set`, {
    tokenPreview: maskToken(finalToken),
    userId: tokenData.user_id,
  })

  // locale 보정: state 또는 referer로 onset locale 추정 — 기본은 /insights.
  // 미들웨어가 Accept-Language 기반으로 prefix(en) 처리 가능하므로 prefix 미부여.
  return NextResponse.redirect(`${appUrl}/insights`)
}
