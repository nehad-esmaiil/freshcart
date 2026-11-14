import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';
import BoxOpenIcon from '@/app/_Components/BoxOpenIcon';
import PopularCategories from '@/app/_Components/PopularCategories';

export default function EmptyCart() {
  return (
    <section>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 sm:py-16 font-medium">
        <div className="max-w-[400px] mx-auto text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <BoxOpenIcon className="text-5xl text-gray-300" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 text-base font-medium leading-relaxed">
            Looks like you haven&apos;t added anything to your cart yet.
            <br />
            Start exploring our products!
          </p>
          <Link
            className="inline-flex items-center gap-2 bg-green-600 text-white py-3.5 px-8 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg active:scale-[0.98]"
            href="/"
          >
            Start Shopping <FaArrowRightLong />
          </Link>
          <PopularCategories />
        </div>
      </div>
    </section>
  );
}
