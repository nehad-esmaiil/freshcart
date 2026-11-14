import { redirect } from 'next/navigation';
import { getAllProducts, getProductsByCategory, getSingleCategory, getSubcategory, getSingleSubcategories } from '@/api/services/routemisr.service';
import NoBroductsFound from '@/app/_Components/NoBroductsFound/NoBroductsFound';
import ProdictCart from '@/app/_Components/Home/ProductCart/ProdictCart';
import PageHeader from '@/app/_Components/PageHeader/PageHeader';
import BoxOpenIcon from '@/app/_Components/BoxOpenIcon';
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa6';

export default async function page({ searchParams }: { searchParams: Promise<{ category?: string; subcategory?: string; q?: string }> }) {
  const { category, subcategory, q } = await searchParams;
  const query = typeof q === 'string' ? q.trim().slice(0, 100) : '';
  if (query) redirect('/search?' + new URLSearchParams({ q: query }));
  const categoryId = typeof category === 'string' && /^[a-f0-9]{24}$/i.test(category) ? category : undefined;
  const subcategoryId = typeof subcategory === 'string' && /^[a-f0-9]{24}$/i.test(subcategory)
    ? subcategory
    : undefined;
  const [allProducts, categoryDetails, subcategoryDetails] = await Promise.all([
    subcategoryId ? getSingleSubcategories(subcategoryId)
      : categoryId ? getProductsByCategory(categoryId) : getAllProducts(),
    categoryId ? getSingleCategory(categoryId) : undefined,
    subcategoryId ? getSubcategory(subcategoryId) : undefined,
  ]);
  const categoryName = categoryDetails?.name ||
    (categoryId === '6439d30b67d9aa4ca97064b1' ? 'Beauty & Health' : undefined);
  const parentCategory = subcategoryDetails?.category
    ? await getSingleCategory(subcategoryDetails.category)
    : undefined;
  const filterName = subcategoryDetails?.name || categoryName;
  const title = filterName || 'All Products';
  return (
    <>
      <PageHeader
        bgColor={'bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white'}
        container={'container mx-auto px-4 py-10 sm:py-14'}
        flexNav={'flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap'}
        linkName={title}
        iconStyle={'text-3xl'}
        icon={BoxOpenIcon}
        image={parentCategory?.image}
        imageStyle="h-10 w-10 object-contain"
        h1={title}
        desc={'Explore our complete product collection'}
      />
      <div className="container mx-auto px-4 py-8">
        {(categoryId || subcategoryId) && (
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <FaFilter aria-hidden="true" />
              Active Filters:
            </span>
            {filterName && (
              <Link href="/products" aria-label={`Remove ${filterName} filter`} className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 hover:bg-green-200">
                {filterName} <span aria-hidden="true">×</span>
              </Link>
            )}
            <Link href="/products" className="text-gray-500 underline hover:text-gray-700">Clear all</Link>
          </div>
        )}
        <div className="mb-6 text-sm text-gray-500">Showing {allProducts?.length ?? 0} products</div>
        {(categoryId || subcategoryId) && allProducts?.length === 0 ? <NoBroductsFound /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {allProducts?.map((product: import('@/api/types/product.type').Root2) => (
            <ProdictCart key={product.id} product={product} />
          ))}
        </div>
        )}
      </div>
    </>
  );
}
