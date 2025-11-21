import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { StatsCards } from '@/components/admin/dashboard/stats-cards';
import { RevenueChart } from '@/components/admin/dashboard/revenue-chart';
import { RecentOrders } from '@/components/admin/dashboard/recent-orders';
import { TopProducts } from '@/components/admin/dashboard/top-products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Admin Dashboard | Snakzo',
  description: 'Admin dashboard for managing Snakzo e-commerce',
};

async function getDashboardStats() {
  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    // Total revenue
    prisma.order.aggregate({
      where: {
        status: {
          in: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
        },
      },
      _sum: {
        total: true,
      },
    }),
    // Total orders
    prisma.order.count(),
    // Total customers
    prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    }),
    // Total products
    prisma.product.count(),
    // Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    // Top products (by order count)
    prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: 5,
    }),
  ]);

  // Fetch product details for top products
  const productIds = topProducts.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      images: {
        take: 1,
      },
    },
  });

  const topProductsWithDetails = topProducts
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        ...product,
        orderCount: item._count.productId,
        totalSold: item._sum.quantity || 0,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    revenue: totalRevenue._sum.total || 0,
    orders: totalOrders,
    customers: totalCustomers,
    products: totalProducts,
    recentOrders,
    topProducts: topProductsWithDetails,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here is what is happening with your store.
        </p>
      </div>

      {/* Stats cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards
          revenue={stats.revenue}
          orders={stats.orders}
          customers={stats.customers}
          products={stats.products}
        />
      </Suspense>

      {/* Charts and tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue chart */}
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        {/* Top products */}
        <Suspense fallback={<ChartSkeleton />}>
          <TopProducts products={stats.topProducts} />
        </Suspense>
      </div>

      {/* Recent orders */}
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders orders={stats.recentOrders} />
      </Suspense>
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
