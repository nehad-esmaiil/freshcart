'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { FaBox, FaCalendarDays, FaCheck, FaChevronDown, FaClock, FaCreditCard, FaHashtag, FaLocationDot, FaMoneyBill, FaPhone, FaReceipt, FaTruck } from 'react-icons/fa6';
import type { Order } from '@/api/types/allorders.type';

const money = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Africa/Cairo' });

export default function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const items = order.cartItems.map((item) => ({
    ...item,
    title: item.product?.title ?? item.title,
    image: item.product?.imageCover ?? item.image,
    quantity: item.count ?? item.quantity,
    productId: item.product?._id ?? item.productId,
  }));
  const firstItem = items[0];
  const online = ['card', 'online'].includes(order.paymentMethodType?.toLowerCase());
  const PaymentIcon = online ? FaCreditCard : FaMoneyBill;
  const status = order.isDelivered
    ? { label: 'Delivered', icon: FaCheck, color: 'bg-green-100 text-green-600' }
    : order.isPaid
      ? { label: 'On the way', icon: FaTruck, color: 'bg-blue-100 text-blue-600' }
      : { label: 'Processing', icon: FaClock, color: 'bg-amber-100 text-amber-600' };
  const StatusIcon = status.icon;
  const shipping = order.shippingPrice ?? 0;
  const tax = order.taxPrice ?? 0;
  const total = order.totalOrderPrice ?? 0;
  const address = order.shippingAddress;

  return (
    <article className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${expanded ? 'border-green-200 shadow-md' : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md'}`}>
      <div className="p-5 sm:p-6">
        <div className="flex gap-5">
          <div className="relative shrink-0">
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-br from-gray-50 to-white p-2.5 sm:size-28">
              {firstItem?.image ? (
                <Image src={firstItem.image} alt="" width={112} height={112} className="size-full object-contain" />
              ) : <FaBox className="text-gray-400" />}
            </div>
            {items.length > 1 && (
              <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white shadow-lg">
                +{items.length - 1}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className={`mb-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                  <StatusIcon aria-hidden="true" /> {status.label}
                </div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <FaHashtag className="text-xs text-gray-400" /> {order.id}
                </h3>
              </div>
              <span title={online ? 'Online payment' : 'Cash on delivery'} className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${online ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                <PaymentIcon role="img" aria-label={online ? 'Online payment' : 'Cash on delivery'} />
              </span>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><FaCalendarDays className="text-xs text-gray-400" />{date.format(new Date(order.createdAt))}</span>
              <span className="size-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5"><FaBox className="text-xs text-gray-400" />{items.length} items</span>
              {address?.city && <>
                <span className="size-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5"><FaLocationDot className="text-xs text-gray-400" />{address.city}</span>
              </>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p><span className="text-2xl font-bold text-gray-900">{money.format(total)}</span><span className="ml-1 text-sm font-medium text-gray-400">EGP</span></p>
              <button type="button" aria-expanded={expanded} aria-controls={detailsId} onClick={() => setExpanded(!expanded)} className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${expanded ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {expanded ? 'Hide' : 'Details'}
                <FaChevronDown className={`text-xs transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id={detailsId} hidden={!expanded} className="border-t border-gray-100 bg-gray-50/50">
        {expanded && (
          <div className="p-5 sm:p-6">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <span className="flex size-6 items-center justify-center rounded-lg bg-green-100 text-xs text-green-600"><FaReceipt aria-hidden="true" /></span>
              Order Items
            </h4>
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li key={`${item.productId}-${index}`} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4">
                  <div className="size-16 shrink-0 rounded-xl bg-gray-50 p-2">
                    {item.image && <Image src={item.image} alt="" width={64} height={64} className="size-full object-contain" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-500"><span className="font-medium text-gray-700">{item.quantity}</span> × {money.format(item.price)} EGP</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-gray-900">{money.format(item.quantity * item.price)}</p>
                    <p className="text-xs text-gray-400">EGP</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {expanded && (
          <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6">
            <section className="rounded-xl border border-gray-100 bg-white p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <span className="grid size-6 place-items-center rounded-lg bg-blue-100 text-xs text-blue-600"><FaLocationDot aria-hidden="true" /></span>
                Delivery Address
              </h4>
              {address && (
                <address className="space-y-2 not-italic">
                  <p className="font-medium text-gray-900">{address.city}</p>
                  <p className="text-sm leading-relaxed text-gray-600">{address.details}</p>
                  {address.phone && <p className="flex items-center gap-2 pt-1 text-sm text-gray-600"><FaPhone aria-hidden="true" className="text-xs text-gray-400" />{address.phone}</p>}
                </address>
              )}
            </section>
            <section className={`p-4 rounded-xl border ${order.isDelivered ? 'bg-green-100 border-green-200' : order.isPaid ? 'bg-blue-100 border-blue-200' : 'bg-amber-100 border-amber-200'}`}>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <span className={`grid size-6 place-items-center rounded-lg text-xs text-white ${order.isDelivered ? 'bg-green-500' : order.isPaid ? 'bg-blue-500' : 'bg-amber-500'}`}><StatusIcon aria-hidden="true" /></span>
                Order Summary
              </h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd className="font-medium">{money.format(total - shipping - tax)} EGP</dd></div>
                <div className="flex justify-between text-gray-600"><dt>Shipping</dt><dd className="font-medium">{shipping ? `${money.format(shipping)} EGP` : 'Free'}</dd></div>
                {tax > 0 && <div className="flex justify-between text-gray-600"><dt>Tax</dt><dd className="font-medium">{money.format(tax)} EGP</dd></div>}
                <div className="border-t border-gray-200/50 my-2" aria-hidden="true" />
                <div className="flex justify-between pt-1 text-gray-900"><dt className="font-semibold">Total</dt><dd className="text-lg font-bold">{money.format(total)} EGP</dd></div>
              </dl>
            </section>
          </div>
        )}
      </div>
    </article>
  );
}
