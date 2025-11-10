'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/cart-utils';
import {
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusColor,
} from '@/lib/order-utils';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: {
      name: string;
      images: { url: string }[];
    };
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalItemsOrdered = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <p className="mt-1 text-sm text-gray-600">View and track your orders</p>
      </div>

      {/* Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Package className="mb-2 h-8 w-8 text-blue-600" />
            <p className="text-2xl font-bold">{totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <ShoppingBag className="mb-2 h-8 w-8 text-green-600" />
            <p className="text-2xl font-bold">{totalItemsOrdered}</p>
            <p className="text-sm text-gray-600">Items Ordered</p>
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold">No orders yet</h3>
          <p className="mb-6 text-gray-600">
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here.
          </p>
          <Link href="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      Order #{order.orderNumber}
                    </h3>
                    <Badge className={getOrderStatusColor(order.status as any)}>
                      {getOrderStatusLabel(order.status as any)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {order.items.slice(0, 5).map((item, index) => (
                  <div key={index} className="shrink-0">
                    <img
                      src={item.product.images[0]?.url || '/placeholder.png'}
                      alt={item.product.name}
                      className="h-16 w-16 rounded border object-cover"
                    />
                  </div>
                ))}
                {order.items.length > 5 && (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border bg-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      +{order.items.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
