import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { logServer } from '@/lib/log'

const LOG_PREFIX = '[data-deletion-callback]'

/**
 * Meta 데이터 삭제 콜백 (Data Deletion Callback) 스펙 구현.
 *
 * 요구사항 (Meta 공식 문서):
 *   POST  Content-Type: application/x-www-form-urlencoded
 *   body: signed_request=<HMAC>.<base64url(payload)>
 *
 *   응답 (200, JSON):
 *     {
 *       "url": "<status-check URL>",
 *       "confirmation_code": "<unique code>"
 *     }
 *
 * 참고: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 */

function base64urlToBuffer(input: string): Buffer {
  // base64url → base64 변환 후 padding 보정
  let s = input.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64')
}

interface SignedRequestPayload {
  user_id?: string
  algorithm?: string
  issued_at?: number
}

/**
 * signed_request 를 HMAC-SHA256 으로 검증하고 payload 를 반환한다.
 * 검증 실패 시 null.
 */
function verifySignedRequest(
  signedRequest: string,
  appSecret: string
): SignedRequestPayload | null {
  const dotIdx = signedRequest.indexOf('.')
  if (dotIdx === -1) return null

  const encodedSig = signedRequest.slice(0, dotIdx)
  const encodedPayload = signedRequest.slice(dotIdx + 1)

  let sig: Buffer
  let payloadBuf: Buffer
  try {
    sig = base64urlToBuffer(encodedSig)
    payloadBuf = base64urlToBuffer(encodedPayload)
  } catch {
    return null
  }

  const expectedSig = crypto
    .createHmac('sha256', appSecret)
    .update(encodedPayload)
    .digest()

  if (
    sig.length !== expectedSig.length ||
    !crypto.timingSafeEqual(sig, expectedSig)
  ) {
    logServer.warn(`${LOG_PREFIX} signature mismatch`)
    return null
  }

  try {
    const parsed = JSON.parse(payloadBuf.toString('utf8')) as SignedRequestPayload
    if (parsed.algorithm && parsed.algorithm !== 'HMAC-SHA256') {
      logServer.warn(`${LOG_PREFIX} unexpected algorithm`, {
        algorithm: parsed.algorithm,
      })
      return null
    }
    return parsed
  } catch {
    return null
  }
}

/**
 * 사용자별 unique confirmation code 를 생성한다.
 * 형식: del_<timestamp>_<rand8>_<userId?>
 */
function generateConfirmationCode(userId?: string): string {
  const ts = Date.now().toString(36)
  const rand = crypto.randomBytes(4).toString('hex')
  const uid = userId ? `_${userId}` : ''
  return `del_${ts}_${rand}${uid}`
}

export async function POST(request: NextRequest) {
  const appSecret = process.env.THREADS_APP_SECRET
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  let signedRequest: string | null = null
  try {
    const formData = await request.formData()
    const val = formData.get('signed_request')
    if (typeof val === 'string') signedRequest = val
  } catch {
    // form-urlencoded 가 아닌 경우 (JSON 등) 도 받아들임
    try {
      const json = await request.json()
      if (typeof json?.signed_request === 'string') {
        signedRequest = json.signed_request
      }
    } catch {
      // 본문 없음
    }
  }

  let userId: string | undefined
  if (signedRequest && appSecret) {
    const payload = verifySignedRequest(signedRequest, appSecret)
    if (payload?.user_id) {
      userId = payload.user_id
      logServer.info(`${LOG_PREFIX} verified deletion request`, { userId })
    } else {
      logServer.warn(`${LOG_PREFIX} invalid or unverified signed_request`)
    }
  } else if (!signedRequest) {
    // Meta 의 URL 검증 단계에서는 signed_request 없이 POST 만 보낼 수 있다.
    // 이 경우에도 스펙에 맞는 응답을 돌려준다.
    logServer.info(`${LOG_PREFIX} POST received without signed_request (likely validation ping)`)
  } else {
    logServer.warn(`${LOG_PREFIX} signed_request present but THREADS_APP_SECRET missing`)
  }

  const confirmationCode = generateConfirmationCode(userId)
  const statusUrl = `${appUrl}/deletion-status?code=${encodeURIComponent(confirmationCode)}`

  // 실제 삭제 작업:
  // 본 서비스는 사용자 데이터를 영구 저장하지 않으며, 모든 캐시는 5분 내 자동 만료된다.
  // 따라서 즉시 deletion 이 완료된 것으로 간주한다. (별도 작업 불필요)
  logServer.info(`${LOG_PREFIX} responding`, {
    confirmationCode,
    hasUserId: Boolean(userId),
  })

  return NextResponse.json(
    {
      url: statusUrl,
      confirmation_code: confirmationCode,
    },
    { status: 200 }
  )
}
