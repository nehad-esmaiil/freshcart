'use server';
import { readRouteAction } from '@/api/routeResponse';
import { getAccessToken } from '@/utilities';
export async function AddToWishlist(productId: string) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Please login first');
  }
  const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
    method: 'POST',
    headers: { token: token as string, 'content-type': 'application/json' },
    body: JSON.stringify({ productId: productId }),
    signal: AbortSignal.timeout(8000),
  });
  return readRouteAction(res);
}
export async function getLoggedUserWishlist() {
  const token = await getAccessToken();
  const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
    method: 'GET',
    headers: { token: token as string, 'content-type': 'application/json' },
  });
  return readRouteAction(res);
}
export async function RemoveFromWishlist(productId: string) {
  const token = await getAccessToken();
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
    method: 'DELETE',
    headers: { token: token as string, 'content-type': 'application/json' },
  });
  return readRouteAction(res);
}
