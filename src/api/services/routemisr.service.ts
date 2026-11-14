import { readRouteJson } from '@/api/routeResponse';
import type { AllCategory, Brand, Root2, Subcategory } from '../types/product.type';

export async function getAllProducts(): Promise<Root2[] | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products`,{ cache: 'no-store' });
    if (!res.ok) throw new Error('Could not load catalog data from Route.');
    const data = await readRouteJson(res);
    if (data?.data == null) throw new Error('Route returned invalid catalog data.');
    return data.data;
  } catch {
    return undefined;
  }
}
export async function getSingleProduct(id: string): Promise<Root2> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
    if (!res.ok) throw new Error('Could not load catalog data from Route.');
    const data = await readRouteJson(res);
    if (data?.data == null) throw new Error('Route returned invalid catalog data.');
    return data.data;
  } catch {
    throw new Error('Failed to fetch product');
  }
}
export async function getAllCategory(): Promise<AllCategory[] | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories`);
    if (!res.ok) throw new Error('Could not load catalog data from Route.');
    const data = await readRouteJson(res);
    if (data?.data == null) throw new Error('Route returned invalid catalog data.');
    return data.data;
  } catch {
    return undefined;
  }
}
export async function getSingleCategory(id: string): Promise<AllCategory | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`);
    if (!res.ok) throw new Error('Could not load catalog data from Route.');
    const data = await readRouteJson(res);
    if (data?.data == null) throw new Error('Route returned invalid catalog data.');
    return data.data;
  } catch {
    return undefined;
  }
}
export async function getAllBrands(): Promise<Brand[] | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`);
    if (!res.ok) throw new Error('Could not load catalog data from Route.');
    const data = await readRouteJson(res);
    if (data?.data == null) throw new Error('Route returned invalid catalog data.');
    return data.data;
  } catch {
    return undefined;
  }
}
export async function getBrandDetails(id: string): Promise<Brand | undefined> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Could not load catalog data from Route.');
    const data = await readRouteJson(res);
  if (data?.data == null) throw new Error('Route returned invalid catalog data.');
    return data.data;
}

export async function getProductsByBrand(id: string): Promise<Root2[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products?brand=${id}`);
    if (!res.ok) throw new Error('Could not load catalog data from Route.');
    const data = await readRouteJson(res);
    if (data?.data == null) throw new Error('Route returned invalid catalog data.');
    return data.data;
  } catch {
    throw new Error('Failed to fetch product');
  }
}
export async function getCategorySubcategories(id: string): Promise<Subcategory[]> {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/subcategories?category=${encodeURIComponent(id)}`,
  );
  const result = await readRouteJson(response);
  if (!response.ok || !Array.isArray(result?.data)) {
    throw new Error('Could not load subcategories for this category.');
  }
  return result.data.filter((subcategory: Subcategory) => subcategory.category === id);
}
export async function getSingleSubcategories(id: string): Promise<Root2[]> {
  const products = await getSearchCatalog();
  return products.filter((product) => product.subcategory?.some((subcategory) => subcategory._id === id));
}
export async function getProductsByCategory(id: string) {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products?category=${id}`
  );
  if (!res.ok) throw new Error('Could not load catalog data from Route.');
    const data = await readRouteJson(res);
  if (data?.data == null) throw new Error('Route returned invalid catalog data.');
    return data.data;
}

export async function getSubcategory(id: string): Promise<Subcategory | undefined> {
  const response = await fetch('https://ecommerce.routemisr.com/api/v1/subcategories/' + encodeURIComponent(id));
  if (!response.ok) return undefined;
  return (await readRouteJson(response))?.data;
}

async function getSearchCatalog(): Promise<Root2[]> {
  async function readPage(page: number) {
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/products?limit=50&page=' + page,
      { next: { revalidate: 300 } });
    const result = await readRouteJson(response);
    if (!response.ok || !Array.isArray(result?.data)) throw new Error('Could not search products.');
    return result;
  }
  const first = await readPage(1);
  const rest = await Promise.all(
    Array.from({ length: (first.metadata?.numberOfPages ?? 1) - 1 }, (_, i) => readPage(i + 2)),
  );
  return [first, ...rest].flatMap((page) => page.data);
}

export async function searchProducts(query: string): Promise<Root2[]> {
  const terms = query.trim().toLowerCase().split(/\s+/);
  const products = await getSearchCatalog();
  return products.filter((product) => {
    const searchable = [product.title, product.brand?.name, product.category?.name].join(' ').toLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}
