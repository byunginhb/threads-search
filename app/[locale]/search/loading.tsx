import { Skeleton } from '@/components/ui/skeleton'
import { PostsSkeleton } from '@/components/loading/posts-skeleton'

export default function SearchLoading() {
  return (
    <div className="max-w-[620px] mx-auto">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-[620px] mx-auto px-4 py-3 flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-full" />
          <Skeleton className="h-9 w-16 rounded-full" />
        </div>
      </div>
      <PostsSkeleton count={8} />
    </div>
  )
}
