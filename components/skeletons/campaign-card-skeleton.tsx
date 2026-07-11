export function CampaignCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 animate-pulse">
      <div className="w-full md:w-48 h-48 rounded-xl bg-neutral-200 dark:bg-neutral-800 shrink-0"></div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start mb-2">
             <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
             <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
