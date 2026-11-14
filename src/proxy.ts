import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(requset: NextRequest) {
  const protectedRoutes = [
    '/profile',
    '/checkout',
    '/orders',
    '/cart/checkout',
  ];
  const authRoutes = [
    '/login',
    '/register',
    '/forget-password',
  ];
  const myPath = requset.nextUrl.pathname;
  if (myPath === '/allorders' || myPath === '/allorders/') {
    const orders = requset.nextUrl.clone();
    orders.pathname = '/orders';
    return NextResponse.redirect(orders, 308);
  }
  const myToken = await getToken({
    req: requset,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const token = myToken?.routeToken;
  if (!token && protectedRoutes.some((path) => myPath.startsWith(path))) {
    const login = new URL('/login', requset.url);
    if (myPath === '/orders' || myPath === '/profile' || myPath.startsWith('/profile/')) {
      login.searchParams.set('callbackUrl', myPath + requset.nextUrl.search);
    }
    return NextResponse.redirect(login);
  }
  if (token && myPath === '/profile') {
    return NextResponse.redirect(new URL('/profile/addresses', requset.url));
  }
  if (token && authRoutes.some((path) => myPath.startsWith(path))) {
    return NextResponse.redirect(new URL('/', requset.url));
  }
  return NextResponse.next();
}
export const config = {
  // matcher: '/about/:path*',
  matcher: [
    '/profile/:path*',
    '/checkout/:path*',
    '/allorders/:path*',
    '/orders/:path*',
    '/cart/checkout/:path*',
    '/login',
    '/register',
    '/forget-password',
  ],
};
