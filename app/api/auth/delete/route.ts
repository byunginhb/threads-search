import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await request.json()
  } catch {
    // ignore parse errors
  }
  return NextResponse.json({ success: true })
}
