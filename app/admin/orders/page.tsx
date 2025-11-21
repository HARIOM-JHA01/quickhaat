import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { OrdersTable } from '@/components/admin/orders/orders-table';
import { OrdersTableSkeleton } from '@/components/admin/orders/orders-table-skeleton';
import { OrderStatus } from '@prisma/client';

export const metadata = {
  title: 'Orders | Admin Dashboard',
  description: 'Manage customer orders',
};

interface SearchParams {
  page?: string;
  status?: string;
}

async function getOrders(searchParams: SearchParams) {
  const page = Number(searchParams.page) || 1;
  const perPage = 10;
  const status = searchParams.status || '';

  const where =
    status && status in OrderStatus ? { status: status as OrderStatus } : {};

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
    currentPage: page,
  };
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { orders, totalCount, totalPages, currentPage } =
    await getOrders(resolvedSearchParams);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-500">
          Manage customer orders ({totalCount} orders)
        </p>
      </div>

      {/* Orders table */}
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersTable
          orders={orders}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}
