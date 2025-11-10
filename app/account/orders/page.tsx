"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/cart-utils";
import {
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/order-utils";

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
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account/orders");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setIsLoading(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">View and track your orders</p>
        </div>

        {/* Stats */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Package className="h-8 w-8 text-indigo-600 mb-2" />
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ShoppingBag className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold">{totalItemsOrdered}</p>
              <p className="text-sm text-gray-600">Items Ordered</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Link href="/">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        Order #{order.orderNumber}
                      </h3>
                      <Badge
                        className={getOrderStatusColor(order.status as any)}
                      >
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
                      <p className="text-lg font-bold text-indigo-600">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {order.items.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex-shrink-0">
                      <img
                        src={item.product.images[0]?.url || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
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
    </div>
  );
}
