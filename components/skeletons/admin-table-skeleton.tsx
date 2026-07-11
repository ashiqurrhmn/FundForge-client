export function AdminTableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
            <div>
              <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-2"></div>
              <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
