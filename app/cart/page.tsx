'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import CartItem from '@/components/cart/cart-item';
import CartSummary from '@/components/cart/cart-summary';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, clearCart } = useCart();

  const items = cart?.items || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            It looks like you have not added anything to your cart yet. Start
            shopping to fill it up!
          </p>
          <Button asChild size="lg">
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Cart Items</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                >
                  Clear Cart
                </Button>
              </div>

              <Separator className="mb-6" />

              <div>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6 flex gap-4">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CartSummary
                items={items}
                onCheckout={() => router.push('/checkout')}
              />

              {/* Help Section */}
              <div className="mt-6 bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <Link
                    href="/shipping"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>📦</span>
                    <span className="ml-2">Shipping Information</span>
                  </Link>
                  <Link
                    href="/returns"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>↩️</span>
                    <span className="ml-2">Returns & Exchanges</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>💬</span>
                    <span className="ml-2">Contact Support</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
