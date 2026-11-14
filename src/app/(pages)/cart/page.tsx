'use client';
import { toast } from 'react-toastify';
import { getCartTotals } from '@/api/cartTotals';
import CartItems from './CartItems';
import CartSummary from './CartSummary';
import CartCoupon from './CartCoupon';
import EmptyCart from './EmptyCart';
import { Dialog } from '@base-ui/react/dialog';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import NavbarIcon from '@/app/_Components/Navbar/NavbarIcons';
import { FaTrash } from 'react-icons/fa6';
import {
  getLoggedUserCart,
  applyCartCoupon,
  RemoveAllProductsFromCart,
  RemoveProduct,
  UpdateProductQuantity,
} from '@/actions/addToCart.action';
import { cartData } from '@/api/types/cart.type';
import { CartContext } from '@/context/CartContext';

export default function Cart() {
  const { numOfCartItems, setnumOfCartItems, guestItems, cartReady, cartStatus, updateGuestItems, saveGuestItems, updateAccountCartProducts } = useContext(CartContext);

  const [accountCart, setproductData] = useState<null | cartData>(null);
  const [disabledUpdate, setdisabledUpdate] = useState(false);
  const [updateLoading, setupdateLoading] = useState(false);
  const [productIdLoading, setproductIdLoading] = useState<null | string>(null);
  const isGuest = cartStatus === 'unauthenticated';
  const productData = isGuest ? {
    products: guestItems as cartData['products'],
    totalCartPrice: (guestItems as cartData['products']).reduce((total, item) => total + item.price * item.count, 0),
  } : accountCart;
  const [couponCode, setCouponCode] = useState('');
  const [couponPending, setCouponPending] = useState(false);
  const totals = getCartTotals(productData);
  const maxPrice = 500;
  const currentPrice = productData?.totalCartPrice || 0;
  const progress = Math.min((currentPrice / maxPrice) * 100, 100);
  const remaining = maxPrice - currentPrice;
  const [cartId, setcartId] = useState('');

  async function applyCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isGuest || couponPending || !couponCode.trim()) return;
    setCouponPending(true);
    try {
      const result = await applyCartCoupon(couponCode);
      if (result.status !== 'success') {
        toast.error(result.message || 'Could not apply this promo code.');
        return;
      }
      const refreshed = await getLoggedUserCart();
      const updatedCart = refreshed.status === 'success' && Array.isArray(refreshed.data?.products)
        ? refreshed.data : result.data;
      if (Array.isArray(updatedCart?.products)) {
        setproductData(updatedCart);
        updateAccountCartProducts(updatedCart.products);
      }
      setCouponCode('');
      toast.success('Promo code applied.');
    } catch {
      toast.error('Could not confirm the promo code. Please try again.');
    } finally {
      setCouponPending(false);
    }
  }

  async function getProductCart() {
    const res = await getLoggedUserCart();
    if (res.status === 'success') {
      setproductData(res.data);
      updateAccountCartProducts(res.data?.products);
      setcartId(res.cartId);
    }
  }
  async function updateProduct(productId: string, count: number, sign: string) {
    if (isGuest) { updateGuestItems(productId, count); return; }
    setproductIdLoading(productId);
    setdisabledUpdate(true);
    setupdateLoading(true);
    const res = await UpdateProductQuantity(productId, count);
    if (res.status === 'success') {
      setproductData(res.data);
      updateAccountCartProducts(res.data?.products);

      if (sign === '+') {
        setnumOfCartItems(numOfCartItems + 1);
      } else {
        setnumOfCartItems(numOfCartItems - 1);
      }
      setdisabledUpdate(false);
      setupdateLoading(false);
    } else {
      setdisabledUpdate(false);
      setupdateLoading(false);
    }
  }
  async function RemoveProductFromCart(productId: string, count: number) {
    if (isGuest) { updateGuestItems(productId, 0); return; }
    setupdateLoading(true);
    setproductIdLoading(productId);
    const res = await RemoveProduct(productId);
    if (res.status === 'success') {
      setproductData(res.data);
      updateAccountCartProducts(res.data?.products);
      if (res.status === 'success') {
        setproductData(res.data);
        updateAccountCartProducts(res.data?.products);
        setnumOfCartItems(numOfCartItems - count);
        setupdateLoading(false);
      } else {
        setupdateLoading(false);
      }
    }
  }
  async function clearCart() {
    if (isGuest) { saveGuestItems([]); return; }
    const res = await RemoveAllProductsFromCart();
    if (res.status === 'success') {
      setproductData(res.data);
      updateAccountCartProducts(res.data?.products);
      setnumOfCartItems(0);
    }
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cartReady && cartStatus === "authenticated") getProductCart();
  }, [cartReady, cartStatus]);

  if (!cartReady || !productData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-30">
        <div className="text-center">
          {/* Circle Background */}
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            {/* Spinner */}
            <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          {/* Text */}
          <h2 className="text-gray-700 font-medium">Loading your cart...</h2>
          <p className="text-gray-400 text-sm mt-1">Just a moment</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {productData?.products && productData?.products?.length > 0 ? (
        <>
          <section>
            <div className="bg-gray-50 min-h-screen py-8">
              <div className="container mx-auto px-4">
                <div className="mb-4">
                  <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link className="hover:text-green-600 transition" href="/">
                      Home
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Shopping Cart</span>
                  </nav>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="bg-linear-to-r from-[#16a34a] to-[#15803d] text-white w-12 h-12 rounded-xl flex items-center justify-center">
                          <NavbarIcon name="Cart" />
                        </span>
                        Shopping Cart
                      </h1>
                      <p className="text-gray-500 mt-2">
                        You have
                        <span className="font-semibold text-green-600">
                          {' '}
                          {productData?.products.length}
                          {productData?.products.length > 1 ? (
                            <span> items </span>
                          ) : (
                            <span> item </span>
                          )}
                        </span>
                        in your cart
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <CartItems products={productData.products} {...{ updateLoading, productIdLoading, disabledUpdate, updateProduct, RemoveProductFromCart }} />
                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                      <Link
                        className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2"
                        href="/"
                      >
                        <span>←</span> Continue Shopping
                      </Link>
                      <Dialog.Root>
                        <Dialog.Trigger className="group flex cursor-pointer items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-500 disabled:opacity-50">
                          <FaTrash className="text-xs transition-transform group-hover:scale-110" />
                          <span>Clear all items</span>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0" />
                          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white px-6 pt-8 pb-5 text-center font-medium shadow-2xl outline-none transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0">
                            <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-red-50 to-orange-50">
                              <svg className="size-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <Dialog.Title className="mb-2 text-2xl font-bold text-gray-900">Clear Your Cart?</Dialog.Title>
                            <Dialog.Description className="mx-auto max-w-xs text-sm leading-relaxed text-gray-500">
                              All items will be removed from your cart. This action cannot be undone.
                            </Dialog.Description>
                            <div className="mt-9 flex flex-wrap justify-center gap-3">
                              <Dialog.Close className="cursor-pointer rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-200">Keep Shopping</Dialog.Close>
                              <Dialog.Close onClick={() => void clearCart()} className="cursor-pointer rounded-xl bg-red-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600">Yes, Clear All</Dialog.Close>
                            </div>
                          </Dialog.Popup>
                        </Dialog.Portal>
                      </Dialog.Root>
                    </div>
                  </div>
                  <CartSummary {...{ productData, totals, progress, remaining, maxPrice, currentPrice, isGuest, cartId }}>
                        <CartCoupon {...{ isGuest, couponPending, updateLoading, applyCoupon, couponCode, setCouponCode }} />
                  </CartSummary>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <EmptyCart />
      )}
    </>
  );
}
