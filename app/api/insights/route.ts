import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCachedMyPostsWithInsights } from '@/lib/cache'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('threads_token')?.value
  const userId = cookieStore.get('threads_user_id')?.value

  if (!accessToken || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const excludeReplies =
    (searchParams.get('excludeReplies') ?? 'true') !== 'false'

  try {
    const posts = await getCachedMyPostsWithInsights({
      userId,
      accessToken,
      excludeReplies,
    })
    return NextResponse.json({ data: posts })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch insights'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
