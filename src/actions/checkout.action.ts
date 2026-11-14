'use server';
import { readRouteAction } from '@/api/routeResponse';
import { cheackoutSchemaType } from '@/schemas/checkout.schema';
import { headers } from 'next/headers';
import { getAccessToken } from '@/utilities';
export async function onlinPayment(
  productId: string,
  formValus: cheackoutSchemaType,
) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Please login first');
  }
  const configuredUrl = process.env.NEXTAUTH_URL?.trim();
  const requestHeaders = await headers();
  const originHeader = requestHeaders.get('origin');
  const origin = originHeader ? URL.parse(originHeader) : null;
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  const isLocal = process.env.NODE_ENV === 'development' &&
    origin?.protocol === 'http:' &&
    ['localhost', '127.0.0.1'].includes(origin.hostname);
  // Keep the storefront origin so the browser can send its session cookie on return.
  const url = origin && origin.host === host && (origin.protocol === 'https:' || isLocal)
    ? origin.origin
    : configuredUrl;
  if (!url) {
    throw new Error('NEXTAUTH_URL is required for online checkout');
  }
  const query = new URLSearchParams({ url });
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${productId}?${query}`,
    {
      method: 'POST',
      headers: { token: token, 'content-type': 'application/json' },
      body: JSON.stringify({ shippingAddress: formValus }),
    },
  );
  return readRouteAction(res);
}
export async function cashOrder(productId: string, formValus: cheackoutSchemaType) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Please login first');
  }
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${productId}`, {
    method: 'POST',
    headers: { token: token, 'content-type': 'application/json' },
    body: JSON.stringify({ shippingAddress: formValus }),
  });
  return readRouteAction(res);
}
