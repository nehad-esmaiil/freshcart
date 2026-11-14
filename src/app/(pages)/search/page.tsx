import { connection } from 'next/server';
import { getAllBrands, getAllCategory, searchProducts } from '@/api/services/routemisr.service';
import SearchResults from './SearchResults';

export default async function Page() {
  await connection();
  const [products, categories, brands] = await Promise.all([
    searchProducts(''),
    getAllCategory(),
    getAllBrands(),
  ]);
  return <SearchResults products={products} categories={categories ?? []} brands={brands ?? []} />;
}
