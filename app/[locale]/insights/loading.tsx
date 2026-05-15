import { Skeleton } from '@/components/ui/skeleton'

export default function InsightsLoading() {
  return (
    <div className="max-w-[860px] mx-auto">
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 px-4">
        <Skeleton className="h-[260px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
      </div>
    </div>
  )
}
