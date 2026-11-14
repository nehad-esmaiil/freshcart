import { getBrandDetails, getProductsByBrand } from '@/api/services/routemisr.service';
import ProdictCart from '@/app/_Components/Home/ProductCart/ProdictCart';
import { IoMdClose } from 'react-icons/io';
import { FaTags } from 'react-icons/fa6';
import { FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NoBroductsFound from '@/app/_Components/NoBroductsFound/NoBroductsFound';
import PageHeader from '@/app/_Components/PageHeader/PageHeader';
export default async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const brand = await getBrandDetails(id);
  if (!brand) notFound();

  const products = await getProductsByBrand(id);
  const brandName = brand.name;
  return (
    <>
      <PageHeader
        bgColor={'bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white'}
        container={'container mx-auto px-4 py-12 sm:py-16'}
        flexNav={'flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap'}
        linkName={brandName}
        iconStyle={'text-3xl'}
        link={'/brands'}
        nameOfLink={'Brands'}
        icon={FaTags}
        h1={brandName}
        desc={`Shop ${brandName} products`}
      />
      <section>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <FaFilter />
              Active Filters:
            </span>
            <Link
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium hover:bg-violet-200 transition-colors"
              href={`/products`}
            >
              <FaTags className="text-sm" />
              {brandName}
              <IoMdClose className="text-sm" />
            </Link>
            <Link className="text-sm text-gray-500 hover:text-gray-700 underline" href="/products">
              Clear all
            </Link>
          </div>
          <div className="mb-6 text-sm text-gray-500">Showing {products.length} products</div>
          {products.length === 0 ? (
            <NoBroductsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProdictCart key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
