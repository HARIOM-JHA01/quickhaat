import { ProductGridSkeleton } from '@/components/skeletons/product-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar Skeleton */}
          <aside className="lg:w-64 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-6 w-24 mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-9 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <ProductGridSkeleton count={24} />

            {/* Pagination Skeleton */}
            <div className="mt-8 flex justify-center">
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
