import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total revenue
    const ordersResult = await prisma.order.aggregate({
      where: {
        status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: startDate },
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Get previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);

    const prevOrdersResult = await prisma.order.aggregate({
      where: {
        status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: prevStartDate, lt: startDate },
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: startDate },
      },
    });

    const prevCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: prevStartDate, lt: startDate },
      },
    });

    // Get total products
    const totalProducts = await prisma.product.count({
      where: {
        isActive: true,
      },
    });

    // Calculate average order value
    const avgOrderValue =
      ordersResult._count > 0
        ? (ordersResult._sum.total || 0) / ordersResult._count
        : 0;

    const prevAvgOrderValue =
      prevOrdersResult._count > 0
        ? (prevOrdersResult._sum.total || 0) / prevOrdersResult._count
        : 0;

    // Get daily sales for chart
    const dailySales = await prisma.$queryRaw<
      Array<{ date: Date; total: number; count: number }>
    >`
      SELECT 
        DATE("createdAt") as date,
        SUM(total) as total,
        COUNT(*) as count
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
        AND status IN ('PROCESSING', 'SHIPPED', 'DELIVERED')
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Get top products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: { gte: startDate },
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] },
        },
      },
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    // Get product details for top products
    const productIds = topProducts.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        images: { select: { url: true }, take: 1 },
      },
    });

    const topProductsWithDetails = topProducts.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: product?.name || 'Unknown Product',
        image: product?.images[0]?.url || null,
        quantity: item._sum.quantity || 0,
        revenue: item._sum.price || 0,
      };
    });

    // Calculate percentage changes
    const revenueChange =
      prevOrdersResult._sum.total && prevOrdersResult._sum.total > 0
        ? (((ordersResult._sum.total || 0) - prevOrdersResult._sum.total) /
            prevOrdersResult._sum.total) *
          100
        : 0;

    const ordersChange =
      prevOrdersResult._count > 0
        ? ((ordersResult._count - prevOrdersResult._count) /
            prevOrdersResult._count) *
          100
        : 0;

    const customersChange =
      prevCustomers > 0
        ? ((totalCustomers - prevCustomers) / prevCustomers) * 100
        : 0;

    const avgOrderChange =
      prevAvgOrderValue > 0
        ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100
        : 0;

    return NextResponse.json({
      metrics: {
        revenue: {
          value: ordersResult._sum.total || 0,
          change: revenueChange,
        },
        orders: {
          value: ordersResult._count,
          change: ordersChange,
        },
        customers: {
          value: totalCustomers,
          change: customersChange,
        },
        avgOrderValue: {
          value: avgOrderValue,
          change: avgOrderChange,
        },
        totalProducts,
      },
      dailySales: dailySales.map((day) => ({
        date: day.date.toISOString().split('T')[0],
        revenue: Number(day.total),
        orders: Number(day.count),
      })),
      topProducts: topProductsWithDetails,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
