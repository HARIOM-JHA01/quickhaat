import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductsTable } from '@/components/admin/products/products-table';
import { ProductsTableSkeleton } from '@/components/admin/products/products-table-skeleton';

export const metadata = {
  title: 'Products | Admin Dashboard',
  description: 'Manage your products',
};

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  status?: string;
}

async function getProducts(searchParams: SearchParams) {
  const page = Number(searchParams.page) || 1;
  const perPage = 10;
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  const status = searchParams.status || '';

  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              {
                description: { contains: search, mode: 'insensitive' as const },
              },
            ],
          }
        : {},
      category ? { categoryId: category } : {},
      status === 'active'
        ? { isActive: true }
        : status === 'inactive'
          ? { isActive: false }
          : {},
    ],
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        images: {
          take: 1,
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
    currentPage: page,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { products, totalCount, totalPages, currentPage } =
    await getProducts(resolvedSearchParams);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">
            Manage your product inventory ({totalCount} products)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Products table */}
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable
          products={products}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}
