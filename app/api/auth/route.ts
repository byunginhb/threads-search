import { NextResponse } from 'next/server'

export async function GET() {
  const appId = process.env.THREADS_APP_ID
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appId || !appUrl) {
    return NextResponse.json({ error: 'Missing THREADS_APP_ID or NEXT_PUBLIC_APP_URL' }, { status: 500 })
  }

  const redirectUri = `${appUrl}/api/auth/callback`
  const authUrl = new URL('https://threads.net/oauth/authorize')
  authUrl.searchParams.set('client_id', appId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'threads_basic,threads_manage_insights')
  authUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(authUrl.toString())
}
