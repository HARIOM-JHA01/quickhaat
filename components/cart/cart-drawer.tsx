'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice, calculateSubtotal } from '@/lib/cart-utils';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, itemCount, removeFromCart } = useCart();

  const items = cart?.items || [];
  const subtotal = calculateSubtotal(items);

  if (!cart || items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>Your cart is empty</SheetDescription>
          </SheetHeader>

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add items to get started
              </p>
              <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Cart Items */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4">
            {items.map((item) => {
              const image = item.product.images[0];
              return (
                <div key={item.id} className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="shrink-0"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.altText || item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.brand && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.product.brand.name}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span className="font-semibold text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        {/* Footer */}
        <SheetFooter className="flex-col gap-4">
          <div className="flex justify-between text-base font-semibold">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Shipping and taxes calculated at checkout
          </p>
          <div className="grid gap-2">
            <Button asChild size="lg" onClick={() => onOpenChange(false)}>
              <Link href="/cart">View Cart</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
