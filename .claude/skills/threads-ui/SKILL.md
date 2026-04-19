---
name: threads-ui
description: Threads Search UI 컴포넌트 스킬. Threads 앱 스타일의 shadcn/ui 컴포넌트 구현 패턴을 제공한다. ThreadCard, SearchBar, InsightsCard, NavBar 컴포넌트 구현 시 반드시 참조할 것.
---

# Threads UI Components

## 디자인 토큰

### 색상 시스템 (tailwind.config.ts에 추가)
```typescript
// Threads-inspired color palette
colors: {
  threads: {
    bg: {
      DEFAULT: '#ffffff',  // light
      dark: '#101010',     // dark
    },
    surface: {
      DEFAULT: '#f3f3f3',  // light card
      dark: '#1e1e1e',     // dark card
    },
    border: {
      DEFAULT: '#e8e8e8',
      dark: '#2e2e2e',
    },
    text: {
      primary: '#0f0f0f',
      secondary: '#666666',
      'primary-dark': '#f3f3f3',
      'secondary-dark': '#999999',
    },
    accent: '#0095f6',  // action color (파란색)
  }
}
```

## 컴포넌트 스펙

### ThreadCard
```tsx
interface ThreadCardProps {
  id: string
  text: string
  username: string
  permalink: string
  timestamp: string
  mediaType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  // 인사이트 모드일 때 옵션
  insights?: {
    views: number
    likes: number
    replies: number
    reposts: number
    quotes: number
  }
}
```

레이아웃:
```
┌─────────────────────────────────────┐
│ ● avatar  @username  · timestamp    │
│           post text content         │
│           (최대 3줄, 더보기 링크)     │
│                                     │
│ 👁 views  ♡ likes  💬 replies       │
│ 🔁 reposts  ↗ (Threads 링크)        │
└─────────────────────────────────────┘
```

### SearchBar
```tsx
// Threads 스타일 미니멀 검색바
<div class="sticky top-0 bg-background/80 backdrop-blur-sm border-b">
  <div class="max-w-[620px] mx-auto px-4 py-3">
    <Input placeholder="검색..." className="rounded-full bg-muted border-0" />
    {/* TOP/RECENT 토글 */}
    <Tabs defaultValue="top">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="top">인기</TabsTrigger>
        <TabsTrigger value="recent">최신</TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</div>
```

### NavBar (PC + 모바일 반응형)
```tsx
// PC: 좌측 고정 사이드바 (w-[245px])
// 모바일: 하단 탭바 (fixed bottom-0)

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/search', icon: Search, label: '검색' },
  { href: '/insights', icon: BarChart2, label: '인사이트' },
]
```

## 핵심 스타일 규칙

1. **카드 간격**: 구분선 `border-b border-border/50` (그림자 없음)
2. **아바타**: 36px 원형, fallback은 첫 글자 이니셜
3. **텍스트**: `text-[15px] leading-[21px]` (Threads 본문 크기)
4. **타임스탬프**: `formatDistanceToNow` (예: "3시간 전")
5. **호버**: `hover:bg-muted/30 transition-colors` (subtle)
6. **링크**: 외부 링크는 `target="_blank" rel="noopener noreferrer"`

## 피해야 할 패턴
- `bg-gradient-to-*` 배경 그라디언트
- `shadow-lg`, `shadow-xl` 과도한 그림자
- 무지개/컬러풀 배지
- `animate-bounce`, `animate-pulse` 과도한 애니메이션
- 둥근 모서리 과다 (`rounded-3xl` 이상 버튼)

## shadcn 컴포넌트 목록
사용: Button, Input, Tabs, Avatar, Badge, Skeleton, Separator, Sheet (모바일 사이드바)
