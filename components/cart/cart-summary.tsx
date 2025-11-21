'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Truck } from 'lucide-react';
import {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
  calculateTotal,
  calculateSavings,
  isFreeShippingEligible,
  amountNeededForFreeShipping,
  formatPrice,
} from '@/lib/cart-utils';

interface CartSummaryProps {
  items: any[];
  onCheckout?: () => void;
  isCheckoutDisabled?: boolean;
}

export default function CartSummary({
  items,
  onCheckout,
  isCheckoutDisabled = false,
}: CartSummaryProps) {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const savings = calculateSavings(items);
  const total = calculateTotal(subtotal, tax, shipping);

  const freeShippingEligible = isFreeShippingEligible(subtotal);
  const amountForFreeShipping = amountNeededForFreeShipping(subtotal);

  return (
    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <Separator />

      {/* Free Shipping Progress */}
      {!freeShippingEligible && amountForFreeShipping > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Add {formatPrice(amountForFreeShipping)} more for FREE shipping!
              </p>
              <div className="mt-2 bg-blue-100 dark:bg-blue-900/50 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(subtotal / 500) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {freeShippingEligible && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Congratulations! You have qualified for FREE shipping 🎉
            </p>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Savings</span>
            <span className="font-medium">-{formatPrice(savings)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (GST 18%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <Badge variant="secondary" className="bg-green-500 text-white">
                FREE
              </Badge>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      {onCheckout && (
        <>
          <Button
            className="w-full"
            size="lg"
            onClick={onCheckout}
            disabled={isCheckoutDisabled || items.length === 0}
          >
            Proceed to Checkout
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Tax included. Shipping calculated at checkout.
          </p>
        </>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-4">
        <div className="text-center">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-xs text-muted-foreground">Secure Payment</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🚚</div>
          <p className="text-xs text-muted-foreground">Fast Delivery</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">↩️</div>
          <p className="text-xs text-muted-foreground">Easy Returns</p>
        </div>
      </div>
    </div>
  );
}
