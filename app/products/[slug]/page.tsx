import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Share2, Package, Shield, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductGallery from '@/components/product/product-gallery';
import VariantSelector, {
  ProductVariant as VariantSelectorProduct,
} from '@/components/product/variant-selector';
import AddToCartButton from '@/components/product/add-to-cart-button';
import ProductReviews from '@/components/product/product-reviews';
import RelatedProducts from '@/components/product/related-products';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StructuredData } from '@/components/seo/structured-data';
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from '@/lib/structured-data';
import { generateProductMetadata } from '@/lib/seo';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all active products
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      brand: true,
      category: true,
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const image = product.images[0]?.url;

  return generateProductMetadata({
    name: product.name,
    description: product.description || undefined,
    image,
    price: product.price,
    slug: product.slug,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
      isActive: true,
    },
    include: {
      images: {
        orderBy: {
          position: 'asc',
        },
      },
      variants: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          parent: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : 0;

  // Get related products from the same category
  const relatedProducts = product.categoryId
    ? await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          isActive: true,
          NOT: {
            id: product.id,
          },
        },
        include: {
          images: {
            orderBy: {
              position: 'asc',
            },
            take: 1,
          },
          brand: {
            select: {
              name: true,
            },
          },
        },
        take: 4,
        orderBy: {
          createdAt: 'desc',
        },
      })
    : [];

  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;
  const discountPercentage =
    hasDiscount && product.comparePrice
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  // Generate structured data for SEO
  const breadcrumbItems = [
    {
      name: 'Home',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://snakzo.com',
    },
    {
      name: 'Shop',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://snakzo.com'}/shop`,
    },
  ];

  if (product.category) {
    breadcrumbItems.push({
      name: product.category.name,
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || 'https://snakzo.com'
      }/shop?categories=${product.category.slug}`,
    });
  }

  breadcrumbItems.push({
    name: product.name,
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || 'https://snakzo.com'
    }/products/${product.slug}`,
  });

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description || undefined,
    image: product.images[0]?.url,
    price: product.price,
    brand: product.brand?.name,
    category: product.category?.name,
    sku: product.slug,
    availability: 'InStock',
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || 'https://snakzo.com'
    }/products/${product.slug}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen">
      <StructuredData data={[productSchema, breadcrumbSchema]} />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-8 text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/shop"
            className="hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          {product.category?.parent && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/collections/${product.category.parent.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.parent.name}
              </Link>
            </>
          )}
          {product.category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/collections/${product.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* Product Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <Link
                href={`/brands/${product.brand.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
              >
                {product.brand.name}
              </Link>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>

            {/* Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(avgRating)
                        ? 'text-yellow-400'
                        : 'text-muted'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({product._count.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">
                ₹{product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.comparePrice!.toFixed(2)}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    Save {discountPercentage}%
                  </Badge>
                </>
              )}
            </div>

            {/* SKU and Stock */}
            <div className="flex items-center gap-4 text-sm">
              {product.sku && (
                <span className="text-muted-foreground">
                  SKU: {product.sku}
                </span>
              )}
              {product.quantity > 0 ? (
                <Badge variant="default" className="bg-green-500">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Variants */}
            {product.variants.length > 0 && (
              <VariantSelector
                variants={
                  product.variants.map((v) => ({
                    id: v.id,
                    name: v.name,
                    sku: v.sku,
                    price: v.price,
                    quantity: v.quantity,
                    options: (v.options as Record<string, string>) || {},
                  })) as VariantSelectorProduct[]
                }
                basePrice={product.price}
              />
            )}

            {/* Add to Cart */}
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              price={product.price}
              maxQuantity={product.quantity}
              isInStock={product.quantity > 0}
            />

            <Separator />

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">
                    Orders over ₹500
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">
                    100% Protected
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30 Day Return</p>
                </div>
              </div>
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
              Share this product
            </button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'No detailed description available.'}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-2">
                {product.sku && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">SKU</span>
                    <span className="text-muted-foreground">{product.sku}</span>
                  </div>
                )}
                {product.barcode && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Barcode</span>
                    <span className="text-muted-foreground">
                      {product.barcode}
                    </span>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Brand</span>
                    <span className="text-muted-foreground">
                      {product.brand.name}
                    </span>
                  </div>
                )}
                {product.category && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Category</span>
                    <span className="text-muted-foreground">
                      {product.category.name}
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Shipping Information
                  </h4>
                  <p>
                    Free shipping on orders over ₹500. Standard delivery takes
                    3-5 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Return Policy
                  </h4>
                  <p>
                    We offer a 30-day return policy. Items must be unused and in
                    original packaging.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <ProductReviews
            reviews={product.reviews.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            }))}
            avgRating={avgRating}
            totalReviews={product._count.reviews}
            productId={product.id}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
}
