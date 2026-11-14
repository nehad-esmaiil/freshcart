import Link from 'next/link';
import type { ReactNode } from 'react';
import { FaLock, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';
import type { cartData } from '@/api/types/cart.type';
import type { getCartTotals } from '@/api/cartTotals';

type Props = {
  productData: Pick<cartData, 'products' | 'totalCartPrice'>;
  totals: ReturnType<typeof getCartTotals>;
  progress: number;
  remaining: number;
  maxPrice: number;
  currentPrice: number;
  isGuest: boolean;
  cartId: string;
  children: ReactNode;
};

export default function CartSummary({ productData, totals, progress, remaining, maxPrice, currentPrice, isGuest, cartId, children }: Props) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24 shadow-sm">
        <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FaBagShopping />
            Order Summary
          </h2>
          <p className="text-green-100 text-sm mt-1">
            {productData?.products.length}
            {productData?.products.length > 1 ? (
              <span> items </span>
            ) : (
              <span> item </span>
            )}
            in your carts
          </p>
        </div>
        <div className="p-6 space-y-5">
          {currentPrice >= maxPrice ? (
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FaTruck className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-700">Free Shipping!</p>
                <p className="text-sm text-green-600">
                  You qualify for free delivery
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-linear-to-r from-orange-50 to-amber-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaTruck className="text-orange-500" />
                <span className="text-sm font-medium text-gray-700">
                  Add <span>{remaining} EGP</span> for free shipping
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-linear-to-r rounded-full transition-all duration-500
                  ${
                    progress > 80
                      ? 'from-orange-600 to-amber-300'
                      : progress > 40
                        ? 'from-orange-500 to-amber-400'
                        : 'from-orange-600 to-amber-500'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                {productData.totalCartPrice} EGP
              </span>
            </div>
            {totals.discount > 0 && <div className="flex justify-between text-green-700">
              <span>Promo discount</span>
              <span>-{totals.discount.toLocaleString('en-US')} EGP</span>
            </div>}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              {totals.shipping === 0 ? (
                <>
                  <span className="font-medium text-green-600">FREE</span>
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-900">50 EGP</span>
                </>
              )}
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-900 font-semibold">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {totals.total.toLocaleString('en-US')}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">EGP</span>
                </div>
              </div>
            </div>
          </div>
          {children}
          <Link
            className="w-full bg-linear-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-600/20 active:scale-[0.98]"
            href={isGuest ? '/login?callbackUrl=%2Fcart' : `/cart/checkout/${cartId}`}
          >
            <FaLock />
            <span>{isGuest ? 'Sign In to Checkout' : 'Secure Checkout'}</span>
          </Link>
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaShieldAlt className="text-green-500" />
              <span>Secure Payment</span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaTruck className="text-blue-500" />
              <span>Fast Delivery</span>
            </div>
          </div>
          <Link
            className="block text-center text-green-600 hover:text-green-700 text-sm font-medium py-2"
            href="/"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>

  );
}
