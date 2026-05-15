import './globals.css'

/**
 * 루트 layout — 실제 메타데이터/NavBar/Footer/locale별 처리는
 * app/[locale]/layout.tsx 가 담당한다.
 * 여기서는 next-intl 미들웨어를 통해 들어온 [locale] 세그먼트만 통과시킨다.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
