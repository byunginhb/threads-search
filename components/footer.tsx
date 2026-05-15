import Link from 'next/link'

const links = [
  { href: '/privacy', label: '개인정보처리방침' },
  { href: '/terms', label: '서비스 약관' },
  { href: '/data-deletion', label: '데이터 삭제' },
]

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[860px] mx-auto px-4 py-8 flex flex-col items-center gap-3 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Threads-insight팀 · 본 서비스는 Meta Platforms,
          Inc. 의 공식 제품이 아닙니다.
        </p>
      </div>
    </footer>
  )
}
