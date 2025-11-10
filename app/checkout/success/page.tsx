"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { formatPrice } from "@/lib/cart-utils";
import {
  formatOrderDate,
  getEstimatedDeliveryDate,
  getOrderStatusLabel,
  getPaymentStatusLabel,
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
    quantity: number;
    price: number;
    total: number;
    product: {
      slug: string;
      images: { url: string }[];
    };
  }[];
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
        setIsLoading(false);
      });
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">
              {error || "Failed to load order details"}
            </p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
          <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg">
            <span className="text-sm text-gray-600">Order Number: </span>
            <span className="text-lg font-semibold text-indigo-600">
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Order Details Grid */}
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

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Payment Information</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">
                  {order.paymentMethod.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-medium text-yellow-600">
                  {getPaymentStatusLabel(order.paymentStatus as any)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Status</span>
                <span className="font-medium text-green-600">
                  {getOrderStatusLabel(order.status as any)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Estimate */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <Package className="h-6 w-6 text-indigo-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900 mb-1">
                Estimated Delivery
              </h3>
              <p className="text-indigo-800">
                Your order will be delivered by{" "}
                <span className="font-semibold">
                  {getEstimatedDeliveryDate(new Date(order.createdAt))}
                </span>
              </p>
              <p className="text-sm text-indigo-700 mt-2">
                You will receive tracking details once your order is shipped.
              </p>
            </div>
          </div>
        </div>

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
                <img
                  src={item.product.images[0]?.url || "/placeholder.png"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium hover:text-indigo-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
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
              <span>Total Paid</span>
              <span className="text-indigo-600">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/account/orders/${order.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Order Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
