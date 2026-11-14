'use client';

import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { AddToCart, getGuestCartProduct, getLoggedUserCart } from '@/actions/addToCart.action';

export const CartContext = createContext();
const storageKey = 'freshcart.guestCart';

function readGuestCart() {
  try {
    const items = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(items) ? items.filter((item) =>
      /^[a-f0-9]{24}$/i.test(item?.product?._id) && Number.isSafeInteger(item.count) && item.count > 0
    ) : [];
  } catch {
    return [];
  }
}

function countItems(items) {
  return items.reduce((total, item) => total + item.count, 0);
}

export default function CartContextProvider({ children }) {
  const { status } = useSession();
  const onLoginPage = usePathname() === '/login';
  const [numOfCartItems, setnumOfCartItems] = useState(0);
  const [accountProductIds, setAccountProductIds] = useState([]);
  const [guestItems, setGuestItems] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const updateAccountCartProducts = useCallback((products) => {
    setAccountProductIds((products ?? []).map(({ product }) => product?._id || product?.id).filter(Boolean));
  }, []);
  const syncing = useRef(null);

  const saveGuestItems = useCallback((items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
    setGuestItems(items);
    setnumOfCartItems(countItems(items));
  }, []);

  const updateGuestItems = useCallback((id, count) => {
    saveGuestItems(readGuestCart().map((item) =>
      item.product._id === id ? { ...item, count } : item
    ).filter((item) => item.count > 0));
  }, [saveGuestItems]);

  const addItem = useCallback(async (id) => {
    if (status === 'loading') throw new Error('Please wait a moment and try again.');
    if (status === 'authenticated') {
      await syncing.current;
      const result = await AddToCart(id);
      if (result.status !== 'success') throw new Error(result.message || 'Could not add to cart.');
      setnumOfCartItems((count) => count + 1);
      setAccountProductIds((ids) => ids.includes(id) ? ids : [...ids, id]);
      return;
    }
    const details = await getGuestCartProduct(id);
    const product = { ...details, id };
    const items = readGuestCart();
    const existing = items.find((item) => item.product._id === id);
    if (existing) existing.count += 1;
    else items.push({ _id: id, count: 1, price: product.priceAfterDiscount ?? product.price, product });
    saveGuestItems(items);
  }, [status, saveGuestItems]);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      const items = readGuestCart();
      setGuestItems(items);
      setnumOfCartItems(countItems(items));
      setCartReady(true);
      return;
    }
    if (onLoginPage) return;
    if (syncing.current) return;
    setCartReady(false);
    async function syncCart() {
      let saved = 0;
      const items = readGuestCart();
      for (const item of items) {
        while (item.count > 0) {
          const result = await AddToCart(item.product._id);
          if (result.status !== 'success') throw new Error(result.message);
          item.count -= 1;
          saved += 1;
          saveGuestItems(items.filter((entry) => entry.count > 0));
        }
      }
      if (saved) toast.info('Your cart items have been saved!', {
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
        hideProgressBar: false,
        theme: 'light',
      });
    }
    syncing.current = syncCart()
      .catch(() => toast.error('Some cart items could not be saved. They are still on this device.'))
      .then(async () => {
        const result = await getLoggedUserCart();
        if (result.status === 'success') {
          setnumOfCartItems(countItems(result.data?.products ?? []));
          updateAccountCartProducts(result.data?.products);
        }
      })
      .catch(() => {})
      .finally(() => { syncing.current = null; setCartReady(true); });
  }, [status, onLoginPage, saveGuestItems, updateAccountCartProducts]);

  return <CartContext.Provider value={{
    cartProductIds: status === 'authenticated' ? accountProductIds : guestItems.map(({ product }) => product._id || product.id),
    updateAccountCartProducts,
    numOfCartItems, setnumOfCartItems, guestItems, cartReady, addItem, updateGuestItems, saveGuestItems, cartStatus: status,
  }}>{children}</CartContext.Provider>;
}
