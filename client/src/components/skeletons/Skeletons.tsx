function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gl-pebble/60 rounded ${className ?? ''}`} />
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden">
          <Pulse className="h-36 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <Pulse className="h-3 w-16" />
            <Pulse className="h-5 w-3/4" />
            <div className="flex gap-2">
              <Pulse className="h-6 w-20 rounded-full" />
              <Pulse className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="flex gap-8 flex-col sm:flex-row mb-10">
      <Pulse className="w-full sm:w-56 h-56 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-4">
        <Pulse className="h-3 w-24" />
        <Pulse className="h-10 w-2/3" />
        <div className="flex gap-2">
          <Pulse className="h-7 w-20 rounded-full" />
          <Pulse className="h-7 w-24 rounded-full" />
        </div>
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-5/6" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Pulse className="h-3 w-24" />
        <Pulse className="h-10 w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Pulse className="h-64 rounded-xl" />
        <Pulse className="h-64 rounded-xl" />
      </div>
      <Pulse className="h-40 rounded-xl" />
      <Pulse className="h-36 rounded-xl" />
    </div>
  )
}

export function RoutineSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Pulse key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Pulse key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-10 w-36" />
      </div>
      <Pulse className="h-48 rounded-xl" />
      <Pulse className="h-56 rounded-xl" />
    </div>
  )
}

export function ChallengeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <Pulse key={i} className="h-44 rounded-xl" />
      ))}
    </div>
  )
}
