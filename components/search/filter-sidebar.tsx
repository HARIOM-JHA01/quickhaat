'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Props allow categories & brands to be passed from server for hydration
export function FilterSidebar({
  categories,
  brands,
  className,
}: {
  categories: {
    id: string;
    name: string;
    slug: string;
    productCount?: number;
  }[];
  brands: { id: string; name: string; slug: string; productCount?: number }[];
  className?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [minPrice, setMinPrice] = useState<number>(
    Number(params.get('minPrice') || 0)
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    Number(params.get('maxPrice') || 10000)
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    () => params.get('categories')?.split(',').filter(Boolean) || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    () => params.get('brands')?.split(',').filter(Boolean) || []
  );
  const [rating, setRating] = useState<number>(
    Number(params.get('rating') || 0)
  );
  const [sort, setSort] = useState<string>(params.get('sort') || 'relevance');

  // Apply filters with debounce
  useEffect(() => {
    const t = setTimeout(() => {
      const search = new URLSearchParams(Array.from(params.entries()));
      // categories
      if (selectedCategories.length)
        search.set('categories', selectedCategories.join(','));
      else search.delete('categories');
      // brands
      if (selectedBrands.length) search.set('brands', selectedBrands.join(','));
      else search.delete('brands');
      // price
      if (minPrice > 0) search.set('minPrice', String(minPrice));
      else search.delete('minPrice');
      if (maxPrice < 10000) search.set('maxPrice', String(maxPrice));
      else search.delete('maxPrice');
      // rating
      if (rating > 0) search.set('rating', String(rating));
      else search.delete('rating');
      // sort
      if (sort && sort !== 'relevance') search.set('sort', sort);
      else search.delete('sort');
      search.delete('page'); // reset pagination
      router.push(`/search?${search.toString()}`);
    }, 400);
    return () => clearTimeout(t);
  }, [selectedCategories, selectedBrands, minPrice, maxPrice, rating, sort]);

  function toggle(
    list: string[],
    value: string,
    setter: (v: string[]) => void
  ) {
    if (list.includes(value)) setter(list.filter((v) => v !== value));
    else setter([...list, value]);
  }

  return (
    <aside className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Categories
        </h3>
        <div className="mt-3 space-y-2">
          {categories.map((c) => (
            <Label
              key={c.id}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Checkbox
                checked={selectedCategories.includes(c.slug)}
                onCheckedChange={() =>
                  toggle(selectedCategories, c.slug, setSelectedCategories)
                }
              />
              <span className="flex-1">{c.name}</span>
              {c.productCount != null && (
                <span className="text-xs rounded bg-muted px-2 py-0.5">
                  {c.productCount}
                </span>
              )}
            </Label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Brands
        </h3>
        <div className="mt-3 space-y-2">
          {brands.map((b) => (
            <Label
              key={b.id}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Checkbox
                checked={selectedBrands.includes(b.slug)}
                onCheckedChange={() =>
                  toggle(selectedBrands, b.slug, setSelectedBrands)
                }
              />
              <span className="flex-1">{b.name}</span>
              {b.productCount != null && (
                <span className="text-xs rounded bg-muted px-2 py-0.5">
                  {b.productCount}
                </span>
              )}
            </Label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Price Range
        </h3>
        <div className="mt-4">
          <Slider
            defaultValue={[minPrice, maxPrice]}
            min={0}
            max={10000}
            step={50}
            onValueChange={(vals) => {
              setMinPrice(vals[0]);
              setMaxPrice(vals[1]);
            }}
          />
          <div className="mt-2 text-xs text-muted-foreground flex justify-between">
            <span>₹{minPrice}</span>
            <span>₹{maxPrice}</span>
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Minimum Rating
        </h3>
        <div className="flex gap-2 mt-2">
          {[0, 3, 4].map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                rating === r
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white border-transparent'
                  : 'hover:bg-accent'
              )}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Sort By
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {['relevance', 'price_asc', 'price_desc', 'newest', 'rating'].map(
            (s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium border text-left capitalize transition-colors',
                  sort === s
                    ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white border-transparent'
                    : 'hover:bg-accent'
                )}
              >
                {s.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>
      </div>
    </aside>
  );
}
