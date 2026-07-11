export function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 w-full animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-2"></div>
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-6 h-32 flex flex-col justify-between border border-neutral-200/50 dark:border-neutral-800/50">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
              <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
            </div>
            <div>
              <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-2"></div>
              <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-6 md:p-8 h-96 border border-neutral-200/50 dark:border-neutral-800/50"></div>
        <div className="w-full xl:w-80 flex flex-col gap-8">
          <div className="bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-6 h-64 border border-neutral-200/50 dark:border-neutral-800/50"></div>
        </div>
      </div>
    </div>
  );
}
