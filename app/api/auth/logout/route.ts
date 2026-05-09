import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete('threads_token')
  cookieStore.delete('threads_user_id')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '/'
  return NextResponse.redirect(`${appUrl}/auth`)
}
