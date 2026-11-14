'use server';

import { authOptions } from '@/app/next-auth/authOptions';
import { getServerSession } from 'next-auth/next';
import type { OrdersArray } from '../types/allorders.type';

export async function getAllOrders(waitForOrder = false, expectedOrderId?: string): Promise<OrdersArray | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.id;
  if (!userId) return null;

  try {
    const attempts = waitForOrder ? 6 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const response = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${encodeURIComponent(userId)}`, { cache: 'no-store' });
      if (!response.ok) return null;
      const orders: unknown = await response.json();
      if (!Array.isArray(orders)) return null;
      const orderVisible = expectedOrderId ? orders.some((order) => order._id === expectedOrderId) : orders.length > 0;
      if (orderVisible || attempt === attempts - 1) return orders;
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    return null;
  } catch {
    return null;
  }
}
