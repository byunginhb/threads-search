/**
 * 큰 숫자를 K/M 단위로 압축한 문자열로 변환한다.
 * 1234 → "1.2K", 1_500_000 → "1.5M"
 */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0'
  const absN = Math.abs(n)
  if (absN >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (absN >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(Math.trunc(n))
}
