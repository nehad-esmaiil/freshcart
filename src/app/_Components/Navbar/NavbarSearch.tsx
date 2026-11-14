'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavbarIcon from './NavbarIcons';

type Suggestion = { id: string; title: string; brand?: string };

export default function NavbarSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<{ query: string; items: Suggestion[] }>();
  useEffect(() => {
    const term = query.trim();
    if (!open || !term) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/search?' + new URLSearchParams({ q: term }), { signal: controller.signal });
        if (response.ok) {
          const items = await response.json();
          if (!controller.signal.aborted) setResults({ query: term, items });
        }
      } catch {
        // The search form remains available if suggestions fail to load.
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  return (
    <form action="/search" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} className="hidden lg:flex flex-1 max-w-2xl">
      <div className="relative w-full">
        <input
          type="search"
          name="q"
          maxLength={100}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          className="w-full px-5 py-3 pr-12 placeholder:text-gray-400 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all text-sm"
          placeholder="Search for products, brands and more..."
        />
        <button type="submit" aria-label="Search products" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#16a34a] text-white flex items-center justify-center hover:bg-[#15803d] transition-colors">
          <NavbarIcon name="Search" className="text-sm" />
        </button>
        {open && query.trim() && results?.query === query.trim() && (
          <div aria-label="Search suggestions" className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            {results.items.map((item) => (
              <Link key={item.id} href={'/products/' + item.id} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-green-50 focus:bg-green-50">
                {item.title}
                {item.brand && <span className="block text-xs text-gray-500">{item.brand}</span>}
              </Link>
            ))}
            <Link href={'/search?' + new URLSearchParams({ q: query.trim() })} onClick={() => setOpen(false)} className="block border-t border-gray-100 px-4 py-2 text-sm text-green-700 hover:bg-green-50">
              {results.items.length ? 'View all results' : 'No matching products'}
            </Link>
          </div>
        )}
      </div>
    </form>
  );
}
