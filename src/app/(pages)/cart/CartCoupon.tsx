import { useState, type FormEvent } from 'react';
import { FaTag } from 'react-icons/fa6';
import { toast } from 'react-toastify';

type Props = {
  isGuest: boolean;
  couponPending: boolean;
  updateLoading: boolean;
  applyCoupon: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  couponCode: string;
  setCouponCode: (value: string) => void;
};

export default function CartCoupon({ isGuest, couponPending, updateLoading, applyCoupon, couponCode, setCouponCode }: Props) {
  const [showCoupon, setShowCoupon] = useState(false);
  return <>
    {showCoupon ? (
      <form onSubmit={applyCoupon} className="flex flex-wrap gap-2">
        <label htmlFor="cart-promo-code" className="sr-only">Promo code</label>
        <input id="cart-promo-code" autoFocus value={couponCode} maxLength={100}
          onChange={(event) => setCouponCode(event.target.value)}
          placeholder="Enter promo code" disabled={couponPending}
          className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm" />
        <button type="submit" disabled={couponPending || updateLoading || !couponCode.trim()}
          className="cursor-pointer rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {couponPending ? 'Applying…' : 'Apply'}
        </button>
      </form>
    ) : (
      <button type="button" onClick={() => {
        if (isGuest) toast.info('Sign in to apply a promo code.');
        else setShowCoupon(true);
      }} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-gray-600 hover:border-green-400 hover:text-green-600">
        <FaTag /> <span className="text-sm font-medium">Apply Promo Code</span>
      </button>
    )}

  </>;
}
