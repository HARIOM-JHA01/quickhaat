'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/cart-utils';
import { formatPhoneNumber, getEstimatedDeliveryDate } from '@/lib/order-utils';
import type { PaymentMethod } from './payment-step';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
}

interface ReviewStepProps {
  address: Address | null;
  paymentMethod: PaymentMethod | null;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  onBack: () => void;
}

export default function ReviewStep({
  address,
  paymentMethod,
  cartItems,
  subtotal,
  tax,
  shipping,
  total,
  onBack,
}: ReviewStepProps) {
  const [notes, setNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const router = useRouter();

  const paymentMethodLabels = {
    CASH_ON_DELIVERY: 'Cash on Delivery',
    CARD: 'Credit/Debit Card',
    STRIPE: 'Online Payment',
  };

  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) {
      toast.error('Missing required information');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressId: address.id,
          paymentMethod,
          notes: notes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to place order');
      }

      const order = await response.json();
      toast.success('Order placed successfully!');
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to place order'
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!address || !paymentMethod) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Missing required information</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Review Your Order</h2>

      {/* Shipping Address */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">Shipping Address</h3>
        </div>
        <div className="text-gray-700">
          <p className="font-medium">{address.fullName}</p>
          <p className="text-sm">{address.street}</p>
          <p className="text-sm">
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="text-sm">Phone: {formatPhoneNumber(address.phone)}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">Payment Method</h3>
        </div>
        <p className="text-gray-700">{paymentMethodLabels[paymentMethod]}</p>
      </div>

      {/* Order Items */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">
            Order Items ({cartItems.length})
          </h3>
        </div>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img
                src={item.product.images[0]?.url || '/placeholder.png'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × {formatPrice(item.product.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (18% GST)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-indigo-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <span className="font-medium">Estimated Delivery:</span>{' '}
          {getEstimatedDeliveryDate()}
        </p>
      </div>

      {/* Order Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Order Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any special instructions for your order..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isPlacingOrder}
          size="lg"
        >
          Back
        </Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          size="lg"
          className="min-w-[200px]"
        >
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}
