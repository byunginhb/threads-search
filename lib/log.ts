/**
 * 서버 사이드 로깅 헬퍼.
 * - production: 민감 데이터 절대 노출 금지. info/warn/error 만 노출.
 * - non-production: debug 포함 모든 레벨 노출 (액세스 토큰은 항상 마스킹).
 *
 * 사용: logServer.debug('[scope] msg', { ... })
 */

const isProd = process.env.NODE_ENV === 'production'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function emit(level: LogLevel, args: unknown[]): void {
  if (level === 'debug' && isProd) return
  if (level === 'error') {
    console.error(...args)
    return
  }
  if (level === 'warn') {
    console.warn(...args)
    return
  }
  console.log(...args)
}

export const logServer = {
  debug: (...args: unknown[]) => emit('debug', args),
  info: (...args: unknown[]) => emit('info', args),
  warn: (...args: unknown[]) => emit('warn', args),
  error: (...args: unknown[]) => emit('error', args),
}

/**
 * 토큰을 마스킹된 짧은 형태로 변환한다. ("ab...wxyz" 형태)
 * 절대 원본 토큰을 반환하지 않는다.
 */
export function maskToken(token: string | undefined | null): string {
  if (!token) return ''
  if (token.length <= 8) return '***'
  return `${token.slice(0, 2)}...${token.slice(-4)}`
}
