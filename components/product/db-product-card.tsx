import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/cart-utils';

export interface DbProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: { url: string; altText: string | null }[];
    reviews?: { rating: number }[];
  };
}

function averageRating(reviews?: { rating: number }[]) {
  if (!reviews || !reviews.length) return 0;
  return (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);
}

export function DbProductCard({ product }: DbProductCardProps) {
  const img = product.images[0];
  const rating = averageRating(product.reviews);
  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) * 100
      )
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            {img && (
              <Image
                src={img.url}
                alt={img.altText || product.name}
                fill
                sizes="(max-width:768px)50vw,25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            )}
            {hasDiscount && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                -{discountPercent}%
              </span>
            )}
            {rating !== 0 && (
              <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-md">
                ⭐ {rating}
              </span>
            )}
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs line-through text-muted-foreground">
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
