'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { OrderStatus, PaymentStatus } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  MapPin,
  CreditCard,
  ArrowLeft,
  Truck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/cart-utils';
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
} from '@/lib/order-utils';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
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
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        setIsLoading(false);
      });
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order || !confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsCancelling(true);

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel order');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel order'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-red-600">
              Order Not Found
            </h2>
            <p className="mb-6 text-gray-600">
              The order you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
            <Link href="/account/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderProgress = getOrderProgress(order.status as OrderStatus);

  return (
    <div>
      {/* Back Button */}
      <Link href="/account/orders">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </Link>

      {/* Order Header */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold">
              Order #{order.orderNumber}
            </h2>
            <p className="text-sm text-gray-600">
              Placed on {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className={getOrderStatusColor(order.status as OrderStatus)}>
              {getOrderStatusLabel(order.status as OrderStatus)}
            </Badge>
            <Badge
              className={getPaymentStatusColor(
                order.paymentStatus as PaymentStatus
              )}
            >
              {getPaymentStatusLabel(order.paymentStatus as PaymentStatus)}
            </Badge>
          </div>
        </div>

        {/* Order Progress */}
        {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600">Order Progress</span>
              <span className="font-medium">{orderProgress}%</span>
            </div>
            <Progress value={orderProgress} className="h-2" />
          </div>
        )}

        {/* Cancel Button */}
        {canCancelOrder(order.status as any) && (
          <div className="mt-4 border-t pt-4">
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {/* Shipping Address */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Shipping Address</h3>
          </div>
          <div className="space-y-1 text-gray-700">
            <p className="font-medium">{order.address.fullName}</p>
            <p className="text-sm">{order.address.street}</p>
            <p className="text-sm">
              {order.address.city}, {order.address.state}{' '}
              {order.address.postalCode}
            </p>
            <p className="text-sm">
              Phone: {formatPhoneNumber(order.address.phone)}
            </p>
          </div>
        </div>

        {/* Payment & Delivery Info */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Payment & Delivery</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium">
                {order.paymentMethod.replace(/_/g, ' ')}
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
      {order.shipment && order.status === 'SHIPPED' && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Shipment Details</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
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
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">
          Order Items ({order.items.length})
        </h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border-b pb-4 last:border-b-0 flex gap-4"
            >
              <Link href={`/products/${item.product.slug}`}>
                <Image
                  src={item.product.images[0]?.url || '/placeholder.png'}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 cursor-pointer rounded object-cover transition-opacity hover:opacity-80"
                />
              </Link>
              <div className="flex-1">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium transition-colors hover:text-blue-600"
                >
                  {item.name}
                </Link>
                {item.product.brand && (
                  <p className="mt-1 text-sm text-gray-600">
                    Brand: {item.product.brand.name}
                  </p>
                )}
                {item.sku && (
                  <p className="mt-1 text-xs text-gray-500">SKU: {item.sku}</p>
                )}
                <p className="mt-2 text-sm text-gray-600">
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
                ? 'FREE'
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
            <span className="text-blue-600">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Order Notes</h3>
          <p className="text-gray-700">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
