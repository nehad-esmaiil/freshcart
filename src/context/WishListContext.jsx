'use client';

import { createContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { AddToWishlist, getLoggedUserWishlist, RemoveFromWishlist } from '@/actions/addToWishlist.action';
import { getGuestCartProduct } from '@/actions/addToCart.action';

export const WishlistContext = createContext();
const storageKey = 'freshcart.guestWishlist';
const productId = (product) => product._id || product.id;

function readGuestWishlist() {
  try {
    const items = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(items) ? items.filter((item) => item && productId(item)) : [];
  } catch {
    return [];
  }
}

export default function WishlistContextProvider({ children }) {
  const { status } = useSession();
  const onLoginPage = usePathname() === '/login';
  const [items, setItems] = useState(null);
  const syncing = useRef(null);

  useEffect(() => {
    if (status === 'loading' || (status === 'authenticated' && onLoginPage)) return;
    if (status === 'unauthenticated') {
      setItems(readGuestWishlist());
      return;
    }
    if (syncing.current) return;
    async function loadAccountWishlist() {
      const wishlist = await getLoggedUserWishlist();
      if (wishlist.status !== 'success' || !Array.isArray(wishlist.data)) throw new Error();
      const accountItems = [...wishlist.data];
      const saved = new Set(accountItems.map(productId));
      for (const product of readGuestWishlist()) {
        const id = productId(product);
        if (!saved.has(id)) {
          const result = await AddToWishlist(id).catch(() => null);
          if (result?.status !== 'success') continue;
          saved.add(id);
          accountItems.push(product);
        }
        localStorage.setItem(storageKey, JSON.stringify(readGuestWishlist().filter((item) => productId(item) !== id)));
      }
      setItems(accountItems);
      if (readGuestWishlist().length) toast.error('Some wishlist items could not be synced.');
    }
    syncing.current = loadAccountWishlist()
      .catch(() => setItems((current) => current ?? []))
      .finally(() => { syncing.current = null; });
  }, [status, onLoginPage]);

  async function addWishlistItem(id) {
    if (status === 'loading') throw new Error('Please wait a moment and try again.');
    await syncing.current;
    const product = await getGuestCartProduct(id);
    if (status === 'unauthenticated') {
      const next = [...readGuestWishlist().filter((item) => productId(item) !== id), product];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setItems(next);
    } else {
      const result = await AddToWishlist(id);
      if (result.status !== 'success') throw new Error(result.message);
      setItems((current) => [...(current ?? []).filter((item) => productId(item) !== id), product]);
    }
  }

  async function removeWishlistItem(id) {
    if (status === 'loading') throw new Error('Please wait a moment and try again.');
    await syncing.current;
    const remove = (current) => (current ?? []).filter((item) => productId(item) !== id);
    if (status === 'unauthenticated') {
      const next = remove(readGuestWishlist());
      localStorage.setItem(storageKey, JSON.stringify(next));
      setItems(next);
    } else {
      const result = await RemoveFromWishlist(id);
      if (result.status !== 'success') throw new Error(result.message);
      setItems(remove);
    }
  }

  return <WishlistContext.Provider value={{
    wishlistItems: items, wishlistStatus: status,
    numOfWishlistItems: items?.length ?? 0, addWishlistItem, removeWishlistItem,
  }}>{children}</WishlistContext.Provider>;
}
