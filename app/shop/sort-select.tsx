'use client';

import { useRouter } from 'next/navigation';

interface SortSelectProps {
  sort: string;
  params: Record<string, string | string[] | undefined>;
}

export function SortSelect({ sort, params }: SortSelectProps) {
  const router = useRouter();

  const handleSortChange = (value: string) => {
    const search = new URLSearchParams(
      Object.entries(params).flatMap(([k, v]) =>
        Array.isArray(v) ? v.map((vv) => [k, vv]) : [[k, v ?? '']]
      )
    );
    search.set('sort', value);
    search.delete('page');
    router.push(`/shop?${search.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <select
        value={sort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="px-3 py-1.5 rounded-md border bg-background text-sm"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name">Name A-Z</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );
}
