import Image from 'next/image';
import Navbar from '@/components/navbar';
import { DbProductCard } from '@/components/product/db-product-card';
import Newsletter from '@/components/newsletter';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { SortSelect } from './sort-select';

function toArray(v: string | string[] | null | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return v.split(',').filter(Boolean);
}

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categories = toArray(params.categories as any);
  const brands = toArray(params.brands as any);
  const minPrice = Number(params.minPrice || 0);
  const maxPrice = Number(params.maxPrice || 100000);
  const sort = (params.sort as string) || 'newest';
  const page = Math.max(1, Number(params.page || 1));
  const perPage = 12;

  // Build where clause
  const where: any = {
    isActive: true,
    AND: [],
  };

  if (categories.length) {
    where.AND.push({ category: { slug: { in: categories } } });
  }
  if (brands.length) {
    where.AND.push({ brand: { slug: { in: brands } } });
  }
  if (minPrice > 0 || maxPrice < 100000) {
    where.AND.push({ price: { gte: minPrice, lte: maxPrice } });
  }

  // Build orderBy
  let orderBy: any = [{ createdAt: 'desc' }];
  if (sort === 'price_asc') orderBy = [{ price: 'asc' }];
  else if (sort === 'price_desc') orderBy = [{ price: 'desc' }];
  else if (sort === 'name') orderBy = [{ name: 'asc' }];
  else if (sort === 'popular') orderBy = [{ reviews: { _count: 'desc' } }];

  // Fetch data
  const [total, products, categoryList, brandList] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: 'asc' }, take: 1 },
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
      take: 10,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge className="mb-6 animate-fade-up bg-linear-to-r from-indigo-500 to-purple-500 text-white border-0">
              ✨ Shop All Products
            </Badge>
            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl animate-slide-in-left">
              <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Discover
              </span>{' '}
              Amazing Products
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in-right delay-100">
              Explore our curated collection of premium products designed to
              elevate your lifestyle.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 border-b bg-background/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Link href="/shop">
                <Button
                  variant={categories.length === 0 ? 'default' : 'outline'}
                  className={
                    categories.length === 0
                      ? 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0'
                      : 'hover:border-indigo-400'
                  }
                >
                  All Products
                  <Badge variant="secondary" className="ml-2">
                    {total}
                  </Badge>
                </Button>
              </Link>
              {categoryList.slice(0, 5).map((category) => {
                const isActive = categories.includes(category.slug);
                const search = new URLSearchParams(
                  Object.entries(params).flatMap(([k, v]) =>
                    Array.isArray(v) ? v.map((vv) => [k, vv]) : [[k, v ?? '']]
                  )
                );
                if (isActive) {
                  const filtered = categories.filter(
                    (c) => c !== category.slug
                  );
                  if (filtered.length)
                    search.set('categories', filtered.join(','));
                  else search.delete('categories');
                } else {
                  search.set(
                    'categories',
                    [...categories, category.slug].join(',')
                  );
                }
                search.delete('page');

                return (
                  <Link key={category.id} href={`/shop?${search.toString()}`}>
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      className={
                        isActive
                          ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white border-0'
                          : 'hover:border-indigo-400'
                      }
                    >
                      {category.name}
                      <Badge variant="secondary" className="ml-2">
                        {category._count.products}
                      </Badge>
                    </Button>
                  </Link>
                );
              })}
            </div>

            <SortSelect sort={sort} params={params} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {products.length === 0 ? 0 : (page - 1) * perPage + 1}–
            {Math.min(page * perPage, total)} of {total} products
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                No products found matching your criteria.
              </p>
              <Link href="/shop">
                <Button className="mt-4" variant="outline">
                  Clear Filters
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <DbProductCard product={product as any} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/shop?${new URLSearchParams(
                        Object.entries(params).flatMap(([k, v]) =>
                          k === 'page'
                            ? [['page', String(page - 1)]]
                            : Array.isArray(v)
                              ? v.map((vv) => [k, vv])
                              : [[k, v ?? '']]
                        )
                      ).toString()}`}
                    >
                      <Button variant="outline">← Previous</Button>
                    </Link>
                  )}

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, i) => {
                        const pageNum = i + 1;
                        const search = new URLSearchParams(
                          Object.entries(params).flatMap(([k, v]) =>
                            Array.isArray(v)
                              ? v.map((vv) => [k, vv])
                              : [[k, v ?? '']]
                          )
                        );
                        search.set('page', String(pageNum));

                        return (
                          <Link
                            key={pageNum}
                            href={`/shop?${search.toString()}`}
                          >
                            <Button
                              variant={pageNum === page ? 'default' : 'outline'}
                              size="sm"
                              className={
                                pageNum === page
                                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white'
                                  : ''
                              }
                            >
                              {pageNum}
                            </Button>
                          </Link>
                        );
                      }
                    )}
                  </div>

                  {page < totalPages && (
                    <Link
                      href={`/shop?${new URLSearchParams(
                        Object.entries(params).flatMap(([k, v]) =>
                          k === 'page'
                            ? [['page', String(page + 1)]]
                            : Array.isArray(v)
                              ? v.map((vv) => [k, vv])
                              : [[k, v ?? '']]
                        )
                      ).toString()}`}
                    >
                      <Button variant="outline">Next →</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-linear-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-in-left">
              <Badge className="bg-linear-to-r from-orange-500 to-pink-500 text-white border-0">
                🔥 Hot Deal
              </Badge>
              <h2 className="text-4xl font-bold">
                Special Offer
                <br />
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Bundle & Save 30%
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Create your perfect bundle and enjoy massive savings on multiple
                items.
              </p>
              <Button
                size="lg"
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8"
              >
                Start Shopping
              </Button>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/shopbanner/800/800"
                  alt="Shop Banner"
                  width={800}
                  height={800}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-linear-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
}
