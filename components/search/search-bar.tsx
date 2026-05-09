'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  defaultQuery?: string
}

const LOG_PREFIX = '[search-bar]'

/**
 * 외부에서 defaultQuery가 바뀌면 (예: 뒤로가기) 부모에서 `key={defaultQuery}` 로
 * 컴포넌트를 재마운트하도록 한다. (useEffect + setState 패턴 회피)
 */
export function SearchBar({ defaultQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery)
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    const url = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search'
    console.log(`${LOG_PREFIX} submit`, { query: trimmed, url })
    router.push(url)
  }

  const handleClear = () => {
    console.log(`${LOG_PREFIX} clear`)
    setQuery('')
    router.push('/search')
  }

  return (
    <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-40">
      <div className="max-w-[620px] mx-auto px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="내 게시물 검색..."
              className="pl-9 pr-9 rounded-full bg-muted border-0 focus-visible:ring-1"
            />
            {query ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="검색어 지우기"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <Button type="submit" size="sm" className="rounded-full px-5">
            검색
          </Button>
        </form>
      </div>
    </div>
  )
}
