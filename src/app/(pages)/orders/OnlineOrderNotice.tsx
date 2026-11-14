'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function OnlineOrderNotice({ paidOrderIds }: { paidOrderIds: string[] }) {
  const checkoutComplete = useSearchParams().get('checkout') === 'complete';

  useEffect(() => {
    try {
      const pending = sessionStorage.getItem('pending-online-order');
      if (pending) {
        const previous: unknown = JSON.parse(pending);
        if (Array.isArray(previous) && paidOrderIds.some((id) => !previous.includes(id))) {
          sessionStorage.removeItem('pending-online-order');
          toast.success('Payment successful!');
        }
      }
    } catch {
      // The orders page also works when browser storage is unavailable.
    }
    if (checkoutComplete) window.history.replaceState(null, '', '/orders');
  }, [paidOrderIds, checkoutComplete]);

  return null;
}
