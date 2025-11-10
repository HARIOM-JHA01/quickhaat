"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  MapPin,
  CreditCard,
  ArrowLeft,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/cart-utils";
import {
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  getEstimatedDeliveryDate,
  getOrderProgress,
  canCancelOrder,
  formatPhoneNumber,
} from "@/lib/order-utils";

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes: string | null;
  createdAt: string;
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    id: string;
    name: string;
    sku: string | null;
    quantity: number;
    price: number;
    total: number;
    product: {
      slug: string;
      images: { url: string }[];
      brand: {
        name: string;
      } | null;
    };
  }[];
  shipment: {
    carrier: string | null;
    trackingNumber: string | null;
    status: string;
    shippedAt: string | null;
    deliveredAt: string | null;
  } | null;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account/orders");
      return;
    }

    if (status === "authenticated" && orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch order");
          return res.json();
        })
        .then((data) => {
          setOrder(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          toast.error("Failed to load order details");
          setIsLoading(false);
        });
    }
  }, [status, orderId, router]);

  const handleCancelOrder = async () => {
    if (!order || !confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setIsCancelling(true);

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel order");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel order"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Link href="/account/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderProgress = getOrderProgress(order.status as any);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/account/orders">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-600">
                Placed on {formatOrderDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className={getOrderStatusColor(order.status as any)}>
                {getOrderStatusLabel(order.status as any)}
              </Badge>
              <Badge
                className={getPaymentStatusColor(order.paymentStatus as any)}
              >
                {getPaymentStatusLabel(order.paymentStatus as any)}
              </Badge>
            </div>
          </div>

          {/* Order Progress */}
          {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Order Progress</span>
                <span className="font-medium">{orderProgress}%</span>
              </div>
              <Progress value={orderProgress} className="h-2" />
            </div>
          )}

          {/* Cancel Button */}
          {canCancelOrder(order.status as any) && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Shipping Address</h2>
            </div>
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">{order.address.fullName}</p>
              <p className="text-sm">{order.address.street}</p>
              <p className="text-sm">
                {order.address.city}, {order.address.state}{" "}
                {order.address.postalCode}
              </p>
              <p className="text-sm">
                Phone: {formatPhoneNumber(order.address.phone)}
              </p>
            </div>
          </div>

          {/* Payment & Delivery Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Payment & Delivery</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium">
                  {order.paymentMethod.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-medium">
                  {getEstimatedDeliveryDate(new Date(order.createdAt))}
                </p>
              </div>
              {order.shipment?.trackingNumber && (
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-medium">{order.shipment.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shipment Status */}
        {order.shipment && order.status === "SHIPPED" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Shipment Details</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {order.shipment.carrier && (
                <div>
                  <p className="text-sm text-gray-600">Carrier</p>
                  <p className="font-medium">{order.shipment.carrier}</p>
                </div>
              )}
              {order.shipment.shippedAt && (
                <div>
                  <p className="text-sm text-gray-600">Shipped On</p>
                  <p className="font-medium">
                    {formatOrderDate(order.shipment.shippedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Order Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <Link href={`/products/${item.product.slug}`}>
                  <img
                    src={item.product.images[0]?.url || "/placeholder.png"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium hover:text-indigo-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.product.brand && (
                    <p className="text-sm text-gray-600 mt-1">
                      Brand: {item.product.brand.name}
                    </p>
                  )}
                  {item.sku && (
                    <p className="text-xs text-gray-500 mt-1">
                      SKU: {item.sku}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.total)}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18% GST)</span>
              <span className="font-medium">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {order.shippingCost === 0
                  ? "FREE"
                  : formatPrice(order.shippingCost)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">
                  -{formatPrice(order.discount)}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-indigo-600">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Order Notes</h2>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
