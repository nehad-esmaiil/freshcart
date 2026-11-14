import type { cartData } from './types/cart.type';

export function getCartTotals(cart: Pick<cartData, 'totalCartPrice' | 'totalAfterDiscount' | 'totalPriceAfterDiscount'> | null) {
  const subtotal = cart?.totalCartPrice ?? 0;
  const afterDiscount = cart?.totalAfterDiscount ?? cart?.totalPriceAfterDiscount;
  const discountedSubtotal = typeof afterDiscount === 'number' && Number.isFinite(afterDiscount)
    && afterDiscount >= 0 && afterDiscount <= subtotal ? afterDiscount : subtotal;
  const shipping = subtotal === 0 || subtotal >= 500 ? 0 : 50;
  return {
    subtotal,
    discount: Number((subtotal - discountedSubtotal).toFixed(2)),
    shipping,
    total: Number((discountedSubtotal + shipping).toFixed(2)),
  };
}
