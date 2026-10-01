export function PageSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`stat-${index}`} className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-slate-200" />
              <div className="h-3 w-16 rounded-full bg-slate-200" />
            </div>
            <div className="h-7 w-24 rounded-md bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 h-6 w-32 rounded-md bg-slate-200" />
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={`row-${index}`} className="h-20 rounded-2xl border border-slate-200 bg-slate-50" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 h-6 w-36 rounded-md bg-slate-200" />
      <div className="space-y-3">
        <div className="h-12 rounded-2xl bg-slate-100" />
        <div className="h-12 rounded-2xl bg-slate-100" />
        <div className="h-12 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
