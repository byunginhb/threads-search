import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  // 기본 locale(ko)은 prefix 없이, 그 외 locale은 prefix 적용
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
