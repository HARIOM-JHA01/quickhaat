import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import ReviewsTable from '@/components/admin/reviews/reviews-table';
import ReviewsTableSkeleton from '@/components/admin/reviews/reviews-table-skeleton';

export const metadata = {
  title: 'Reviews | Admin Dashboard',
  description: 'Moderate customer reviews',
};

interface ReviewsPageProps {
  searchParams: Promise<{
    status?: string;
    rating?: string;
  }>;
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Moderate and manage customer reviews
          </p>
        </div>
      </div>

      <Suspense fallback={<ReviewsTableSkeleton />}>
        <ReviewsTable
          statusFilter={params.status}
          ratingFilter={params.rating}
        />
      </Suspense>
    </div>
  );
}
