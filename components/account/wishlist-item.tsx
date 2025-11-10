'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Wishlist, Product, ProductImage } from '@prisma/client';

interface WishlistItemProps {
  wishlistItem: Wishlist & {
    product: Product & {
      images: ProductImage[];
    };
  };
}

export function WishlistItem({ wishlistItem }: WishlistItemProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { product } = wishlistItem;

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const response = await fetch(`/api/wishlist/${wishlistItem.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove from wishlist');
      }

      toast.success('Removed from wishlist');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to remove from wishlist'
      );
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add to cart');
      }

      toast.success('Added to cart');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add to cart'
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-red-50"
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
        ) : (
          <X className="h-4 w-4 text-gray-600 hover:text-red-600" />
        )}
      </button>

      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Heart className="h-12 w-12 text-gray-300" />
            </div>
          )}
          {discount > 0 && (
            <Badge className="absolute left-2 top-2 bg-red-500">
              -{discount}%
            </Badge>
          )}
          {product.quantity === 0 && (
            <Badge className="absolute left-2 bottom-2 bg-gray-800">
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.quantity === 0}
          className="mt-4 w-full"
        >
          {isAddingToCart ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
