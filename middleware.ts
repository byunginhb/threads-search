import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // /api, /_next, /_vercel, 정적 파일(.ico, .png 등)은 미들웨어 제외
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
