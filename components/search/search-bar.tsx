'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get('q') || '';
  const [value, setValue] = useState(initial);
  const [debounced, setDebounced] = useState(initial);

  // Debounce search value
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 400);
    return () => clearTimeout(t);
  }, [value]);

  // Push route when debounced changes
  useEffect(() => {
    if (debounced === initial && !debounced) return;
    const search = new URLSearchParams(Array.from(params.entries()));
    if (debounced) {
      search.set('q', debounced);
    } else {
      search.delete('q');
    }
    search.delete('page'); // reset pagination on new search
    router.push(`/search?${search.toString()}`);
  }, [debounced]);

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search products..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
