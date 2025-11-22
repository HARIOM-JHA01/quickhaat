import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  DbProductCard,
  DbProductCardProps,
} from '@/components/product/db-product-card';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';

function toArray(v: string | string[] | null | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return v.split(',').filter(Boolean);
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = (params.q as string) || '';
  const categories = toArray(
    params.categories as string | string[] | undefined
  );
  const brands = toArray(params.brands as string | string[] | undefined);
  const minPrice = Number(params.minPrice || 0);
  const maxPrice = Number(params.maxPrice || 10000);
  const rating = Number(params.rating || 0);
  const sort = (params.sort as string) || 'relevance';
  const page = Math.max(1, Number(params.page || 1));
  const perPage = Math.min(48, Math.max(12, Number(params.perPage || 24)));

  const where: Prisma.ProductWhereInput = { isActive: true };
  const and: Prisma.ProductWhereInput[] = [];
  if (q) {
    and.push({
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ],
    });
  }
  if (categories.length) {
    and.push({ category: { slug: { in: categories } } });
  }
  if (brands.length) {
    and.push({ brand: { slug: { in: brands } } });
  }
  if (minPrice > 0 || maxPrice < 10000) {
    and.push({ price: { gte: minPrice || 0, lte: maxPrice || 10000 } });
  }
  if (rating > 0) {
    // approximate: at least one review >= rating
    and.push({ reviews: { some: { rating: { gte: rating } } } });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [
    { createdAt: 'desc' as const },
  ];
  if (sort === 'price_asc') orderBy = [{ price: 'asc' }];
  else if (sort === 'price_desc') orderBy = [{ price: 'desc' }];
  else if (sort === 'newest') orderBy = [{ createdAt: 'desc' }];
  else if (sort === 'rating') orderBy = [{ reviews: { _count: 'desc' } }];

  const [total, results, categoryFacets, brandFacets] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: 'asc' } },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            categories={categoryFacets.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              productCount: c._count.products,
            }))}
            brands={brandFacets.map((b) => ({
              id: b.id,
              name: b.name,
              slug: b.slug,
              productCount: b._count.products,
            }))}
            className="w-full md:w-64 md:flex-none"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Search</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {total} result{total === 1 ? '' : 's'}
                  {q ? (
                    <>
                      {' '}
                      for <Badge variant="secondary">{q}</Badge>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            <Separator className="mb-6" />

            {results.length === 0 ? (
              <div className="text-center text-muted-foreground py-20">
                No products found. Try adjusting filters or search terms.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((p) => (
                  <DbProductCard
                    key={p.id}
                    product={p as DbProductCardProps['product']}
                  />
                ))}
              </div>
            )}

            {pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => {
                  const n = i + 1;
                  const search = new URLSearchParams(
                    Object.entries(params).flatMap(([k, v]) =>
                      Array.isArray(v) ? v.map((vv) => [k, vv]) : [[k, v ?? '']]
                    )
                  );
                  search.set('page', String(n));
                  return (
                    <Link
                      key={n}
                      href={`/search?${search.toString()}`}
                      className={`px-3 py-1.5 rounded-md text-sm border ${
                        n === page
                          ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white border-transparent'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {n}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
