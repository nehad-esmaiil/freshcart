'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaFilter, FaGripVertical, FaList, FaSearch, FaSlidersH } from 'react-icons/fa';
import type { AllCategory, Brand, Root2 } from '@/api/types/product.type';
import ProdictCart from '@/app/_Components/Home/ProductCart/ProdictCart';

const sorts = [
  ['', 'Relevance'], ['price', 'Price: Low to High'], ['-price', 'Price: High to Low'],
  ['-ratingsAverage', 'Rating: High to Low'], ['title', 'Name: A to Z'], ['-title', 'Name: Z to A'],
];

export default function SearchResults({ products, categories, brands }: {
  products: Root2[];
  categories: AllCategory[];
  brands: Brand[];
}) {
  const params = useSearchParams();
  const [list, setList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const query = params.get('q') ?? '';
  const sort = params.get('sort') ?? '';
  const min = params.get('minPrice') ?? '';
  const max = params.get('maxPrice') ?? '';
  const active = Boolean(query || min || max || params.has('category') || params.has('brand'));

  function update(key: string, value: string, toggle = false) {
    const next = new URLSearchParams(params);
    if (key !== 'page') next.delete('page');
    if (toggle) {
      if (next.getAll(key).includes(value)) next.delete(key, value);
      else next.append(key, value);
    } else if (value) next.set(key, value);
    else next.delete(key);
    window.history.replaceState(null, '', next.size ? '/search?' + next : '/search');
  }

  function clear() { window.history.replaceState(null, '', '/search'); }

  const terms = query.trim().toLowerCase().split(/\s+/);
  const results = products.filter((product) => {
    const label = [product.title, product.category?.name, product.brand?.name].join(' ').toLowerCase();
    return terms.every((term) => label.includes(term)) &&
      (!params.has('category') || params.getAll('category').includes(product.category?._id)) &&
      (!params.has('brand') || params.getAll('brand').includes(product.brand?._id)) &&
      (!min || product.price >= Number(min)) && (!max || product.price <= Number(max));
  });
  results.sort((a, b) => {
    switch (sort) {
      case 'price': return a.price - b.price;
      case '-price': return b.price - a.price;
      case '-ratingsAverage': return b.ratingsAverage - a.ratingsAverage;
      case 'title': return a.title.localeCompare(b.title);
      case '-title': return b.title.localeCompare(a.title);
      default: return 0;
    }
  });
  const pageCount = Math.max(1, Math.ceil(results.length / 12));
  const page = Math.min(pageCount, Math.max(1, Math.floor(Number(params.get('page')) || 1)));

  function options(title: string, key: 'category' | 'brand', items: { _id: string; name: string }[]) {
    return <section>
      <div className="mb-4 flex justify-between">
        <h2 className="font-bold text-gray-900">{title}</h2>
        {params.has(key) && <span className="text-xs font-medium text-green-600">{params.getAll(key).length} selected</span>}
      </div>
      <div className="max-h-52 space-y-2 overflow-y-auto">
        {items.map(({ _id, name }) => <label key={_id} className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
          <input type="checkbox" className="size-4 accent-green-600" checked={params.getAll(key).includes(_id)} onChange={() => update(key, _id, true)} />
          {name}
        </label>)}
      </div>
    </section>;
  }

  const filters = <div className="space-y-6">
    {options('Categories', 'category', categories)}
    <hr className="border-gray-100" />
    <section>
      <h2 className="mb-4 font-bold text-gray-900">Price Range</h2>
      <div className="mb-3 grid grid-cols-2 gap-3">
        {[['minPrice', 'Min (EGP)', min, '0'], ['maxPrice', 'Max (EGP)', max, 'No limit']].map(([key, label, value, placeholder]) =>
          <label key={key} className="text-xs text-gray-500">{label}
            <input type="number" min="0" placeholder={placeholder} value={value} onChange={(e) => update(key, e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </label>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {[500, 1000, 5000, 10000].map((price) =>
          <button key={price} className={'rounded-full px-3 py-1.5 text-xs font-medium ' + (!min && Number(max) === price ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600')} onClick={() => {
            const next = new URLSearchParams(params);
            next.delete('minPrice');
            next.delete('page');
            next.set('maxPrice', String(price));
            window.history.replaceState(null, '', '/search?' + next);
          }}>Under {price >= 1000 ? price / 1000 + 'K' : price}</button>)}
      </div>
    </section>
    <hr className="border-gray-100" />
    {options('Brands', 'brand', brands.slice(0, 15))}
    {active && <button onClick={clear} className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600">Clear All Filters</button>}
  </div>;

  return <div className="min-h-screen bg-gray-50/50">
    <div className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 py-6">
        <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600">Home</Link><span className="text-gray-300">/</span>
          <span className="font-medium text-gray-900">Search Results</span>
        </nav>
        <form className="relative max-w-2xl" onSubmit={(e) => { e.preventDefault(); update('page', ''); }}>
          <FaSearch aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input aria-label="Search for products" placeholder="Search for products..." maxLength={100} value={query} onChange={(e) => update('q', e.target.value)} className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" />
        </form>
        {query && <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">Search Results for &quot;{query}&quot;</h1>
          <p className="mt-1 text-sm text-gray-500">We found {results.length} products for you</p>
        </div>}
      </div>
    </div>
    <div className="container mx-auto flex gap-8 px-4 py-8">
      <aside className="hidden w-64 shrink-0 lg:block"><div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6">{filters}</div></aside>
      <section className="min-w-0 flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm lg:hidden"><FaSlidersH /> Filters</button>
            <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
              <button aria-label="Grid view" aria-pressed={!list} onClick={() => setList(false)} className={'rounded-md p-2 ' + (!list ? 'bg-green-600 text-white' : 'text-gray-500')}><FaGripVertical /></button>
              <button aria-label="List view" aria-pressed={list} onClick={() => setList(true)} className={'rounded-md p-2 ' + (list ? 'bg-green-600 text-white' : 'text-gray-500')}><FaList /></button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-500">Sort by:
            <select value={sort} onChange={(e) => update('sort', e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900">
              {sorts.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        {active && <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-sm text-gray-500"><FaFilter className="text-xs" /> Active:</span>
          {query && <button className="rounded-full bg-gray-100 px-2 py-1" onClick={() => update('q', '')}>&quot;{query}&quot; ×</button>}
          {([['category', categories, 'bg-green-100 text-green-700'], ['brand', brands, 'bg-violet-100 text-violet-700']] as const).flatMap(([key, items, color]) =>
            items.filter((item) => params.getAll(key).includes(item._id)).map((item) =>
              <button key={item._id} className={'rounded-full px-2 py-1 ' + color} onClick={() => update(key, item._id, true)}>{item.name} ×</button>))}
          {(min || max) && <button className="rounded-full bg-amber-100 px-2 py-1 text-amber-700" onClick={() => {
            const next = new URLSearchParams(params);
            for (const key of ['minPrice', 'maxPrice', 'page']) next.delete(key);
            window.history.replaceState(null, '', next.size ? '/search?' + next : '/search');
          }}>{min || 0} - {max || '∞'} EGP ×</button>}
          <button onClick={clear} className="ml-2 text-gray-500 underline">Clear all</button>
        </div>}
        {results.length ? <>
          <div className={list ? 'space-y-4' : 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'}>
            {results.slice((page - 1) * 12, page * 12).map((product) => <ProdictCart key={product._id} product={product} />)}
          </div>
          {pageCount > 1 && <div className="mt-10 flex justify-center gap-2">
            <button aria-label="Previous page" disabled={page === 1} onClick={() => update('page', String(page - 1))} className="size-10 rounded-lg border border-gray-200 disabled:opacity-50">‹</button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) =>
              <button key={number} aria-current={number === page ? 'page' : undefined} onClick={() => update('page', number === 1 ? '' : String(number))} className={'size-10 rounded-lg border border-gray-200 ' + (number === page ? 'bg-green-600 text-white' : '')}>{number}</button>)}
            <button aria-label="Next page" disabled={page === pageCount} onClick={() => update('page', String(page + 1))} className="size-10 rounded-lg border border-gray-200 disabled:opacity-50">›</button>
          </div>}
        </> : <div className="py-20 text-center">
          <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-gray-100"><FaSearch className="text-3xl text-gray-400" /></div>
          <h2 className="mb-2 text-lg font-bold text-gray-900">No Products Found</h2>
          <p className="mb-6 text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
          <button onClick={clear} className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">Clear Filters</button>
        </div>}
      </section>
    </div>
    {showFilters && <div className="fixed inset-0 z-50 lg:hidden">
      <button aria-label="Close filters" onClick={() => setShowFilters(false)} className="absolute inset-0 bg-black/50" />
      <aside className="absolute inset-y-0 right-0 w-80 max-w-full overflow-y-auto bg-white p-6">
        <div className="mb-6 flex justify-between"><h2 className="text-lg font-bold">Filters</h2>
          <button aria-label="Close filters" className="size-8 rounded-full bg-gray-100" onClick={() => setShowFilters(false)}>×</button>
        </div>{filters}
      </aside>
    </div>}
  </div>;
}
