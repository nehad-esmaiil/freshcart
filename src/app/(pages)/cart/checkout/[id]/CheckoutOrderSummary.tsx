import { getCartTotals } from '@/api/cartTotals';
import Image from 'next/image';
import { FaBagShopping, FaTruck, FaBox } from 'react-icons/fa6';
import { FaShieldAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { SpinnerCustom } from '@/app/_Components/ButtonSpinner/ButtonSpinner';
import type { cartData } from '@/api/types/cart.type';

export default function CheckoutOrderSummary( { cartData, paymentMethod, loading }: { cartData: cartData | null; paymentMethod: "cash" | "online"; loading: boolean }) {
  const totals = getCartTotals(cartData);
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm sticky top-4">
        <div className="bg-linear-to-r from-[#16a34a] to-[#15803d] px-6 py-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FaBagShopping />
            Order Summary
          </h2>
          <p className="text-green-100 text-sm mt-1">
            {cartData?.products?.length}
            {(cartData?.products?.length ?? 0) > 1 ? (
              <span> items </span>
            ) : (
              <span> item </span>
            )}
          </p>
        </div>
        <div className="p-5">
          <div className="space-y-3 max-h-56 overflow-y-auto mb-5 pr-1">
            {!cartData
              ? 
                Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 transition-colors animate-pulse"
                  >
                    <div className="w-14 h-14 rounded-lg bg-gray-200 p-1 border border-gray-100 shrink-0"></div>
                    <div className="flex-1 min-w-0 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 w-10 bg-gray-200 rounded shrink-0"></div>
                  </div>
                ))
              :
                cartData.products.map((product) => (
                  <div
                    key={product.product.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-lg bg-white p-1 border border-gray-100 shrink-0">
                      <Image
                        alt={product.product.title}
                        width={60}
                        height={60}
                        className="w-full h-full object-contain"
                        src={product.product.imageCover}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.product.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.count} × {product.price.toLocaleString('en-US')} EGP
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 shrink-0">
                      {(product.count * product.price).toLocaleString('en-US')}
                    </p>
                  </div>
                ))}
          </div>
          <hr className="border-gray-100 my-4" />
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{(cartData?.totalCartPrice ?? 0).toLocaleString('en-US')} EGP</span>
            </div>
            {totals.discount > 0 && <div className="flex justify-between text-green-700">
              <span>Promo discount</span><span>-{totals.discount.toLocaleString('en-US')} EGP</span>
            </div>}
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-2">
                <FaTruck className="text-gray-400" />
                Shipping
              </span>
              {totals.shipping === 0 ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                <span className="font-medium">50 EGP</span>
              )}
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">{totals.total.toLocaleString('en-US')}</span>
                <span className="text-sm text-gray-500 ml-1">EGP</span>
              </div>
            </div>
          </div>
          {paymentMethod === 'online' && (
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-[#16a34a] to-[#15803d] text-white py-6 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <SpinnerCustom />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaShieldAlt /> <span>Proceed to Payment</span>
                </>
              )}
            </Button>
          )}
          {paymentMethod === 'cash' && (
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-[#16a34a] to-[#15803d] text-white py-6 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <SpinnerCustom />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaBox /> <span>Place Order</span>
                </>
              )}
            </Button>
          )}
    
          <div className="flex items-center justify-center gap-4 mt-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaShieldAlt className="text-green-500" /> <span>Secure</span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaTruck className="text-blue-500" /> <span>Fast Delivery</span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaBox className="text-orange-500" /> <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
