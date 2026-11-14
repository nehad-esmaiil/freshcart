'use server';
import { readRouteAction } from '@/api/routeResponse';
import { getSingleProduct } from '@/api/services/routemisr.service';
import { getAccessToken } from '@/utilities';
export async function AddToCart(productId: string) {
  const token = (await getAccessToken()) || "";
  

  const res = await fetch('https://ecommerce.routemisr.com/api/v2/cart', {
    method: 'POST',
    headers: { token: token as string, 'content-type': 'application/json' },
    body: JSON.stringify({ productId: productId }),
  });
  return readRouteAction(res);
}

export async function getLoggedUserCart() {
  const token = (await getAccessToken()) || "";

  const res = await fetch('https://ecommerce.routemisr.com/api/v2/cart', {
    method: 'GET',
    headers: { token: token as string, 'content-type': 'application/json' },
  });
  return readRouteAction(res);
}
export async function UpdateProductQuantity(productId: string, count: number) {
  const token = (await getAccessToken()) || "";

  const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
    method: 'PUT',
    headers: { token: token as string, 'content-type': 'application/json' },
    body: JSON.stringify({ count: count }),
  });
  return readRouteAction(res);
}

export async function RemoveProduct(productId: string) {
  const token = (await getAccessToken()) || "";

  const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
    method: 'DELETE',
    headers: { token: token as string, 'content-type': 'application/json' },
  });
  return readRouteAction(res);
}

export async function RemoveAllProductsFromCart() {
  const token = (await getAccessToken()) || "";

  const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
    method: 'DELETE',
    headers: { token: token as string, 'content-type': 'application/json' },
  });
  return readRouteAction(res);
}
export async function getGuestCartProduct(id: string) {
  if (!/^[a-f0-9]{24}$/i.test(id)) throw new Error('Invalid product.');
  return getSingleProduct(id);
}

export async function applyCartCoupon(code: string) {
  const couponName = code.trim();
  if (!couponName || couponName.length > 100) {
    return { status: 'fail', message: 'Enter a valid promo code.' };
  }
  const token = await getAccessToken();
  if (!token) return { status: 'fail', message: 'Sign in to apply a promo code.' };

  const response = await fetch('https://ecommerce.routemisr.com/api/v2/cart/applyCoupon', {
    method: 'PUT',
    headers: { token, 'content-type': 'application/json' },
    body: JSON.stringify({ couponName }),
  });
  return readRouteAction(response);
}
