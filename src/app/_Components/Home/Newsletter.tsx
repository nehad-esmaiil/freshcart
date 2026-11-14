'use client';

import { useState, type FormEvent } from 'react';
import { FaApple, FaArrowRight, FaEnvelope, FaGift, FaGooglePlay, FaLeaf, FaTruck } from 'react-icons/fa6';

const benefits = [
  { label: 'Fresh Picks Weekly', Icon: FaLeaf },
  { label: 'Free Delivery Codes', Icon: FaTruck },
  { label: 'Members-Only Deals', Icon: FaGift },
];

export default function Newsletter() {
  const [message, setMessage] = useState('');

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Newsletter signup is currently unavailable.');
  }

  return (
    <section className="py-16 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100/50 bg-linear-to-br from-emerald-50 via-white to-teal-50 shadow-2xl shadow-emerald-500/10">
          <div className="pointer-events-none absolute top-0 right-0 size-80 -translate-y-1/2 translate-x-1/4 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 size-64 translate-y-1/2 -translate-x-1/4 rounded-full bg-teal-200/30 blur-3xl" />
          <div className="relative grid gap-8 p-8 lg:grid-cols-5 lg:p-14">
            <div className="space-y-6 lg:col-span-3">
              <div className="flex items-center gap-4">
                <div className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 text-xl text-white shadow-lg shadow-emerald-500/30"><FaEnvelope /></div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Newsletter</h3>
                  <p className="text-xs text-gray-500">50,000+ subscribers</p>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold leading-snug text-gray-900 lg:text-4xl">Get the Freshest Updates <span className="text-emerald-600">Delivered Free</span></h2>
                <p className="mt-3 text-lg text-gray-500">Weekly recipes, seasonal offers &amp; exclusive member perks.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {benefits.map(({ label, Icon }) => (
                  <div key={label} className="flex items-center gap-2.5 rounded-full border border-emerald-100 bg-white/80 px-4 py-2.5 shadow-sm">
                    <span className="grid size-7 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-600"><Icon /></span>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
              <form className="pt-2" onSubmit={subscribe}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input aria-label="Email address" type="email" required placeholder="you@example.com" className="min-w-0 flex-1 rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-gray-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10" />
                  <button type="submit" className="flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25">Subscribe <FaArrowRight /></button>
                </div>
                <p className="mt-3 pl-1 text-xs text-gray-400">✨ Unsubscribe anytime. No spam, ever.</p>
                {message && <p role="status" className="mt-2 text-sm text-gray-700">{message}</p>}
              </form>
            </div>
            <div className="flex items-center lg:col-span-2 lg:border-l lg:border-emerald-100 lg:pl-8">
              <div className="w-full space-y-5 rounded-3xl bg-linear-to-br from-gray-900 to-gray-800 p-8 text-white">
                <div className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">📱 MOBILE APP</div>
                <h3 className="text-2xl font-bold leading-tight">Shop Faster on Our App</h3>
                <p className="text-sm leading-relaxed text-gray-400">Get app-exclusive deals &amp; 15% off your first order.</p>
                <div className="flex flex-col gap-3 pt-2">
                  <a href="#" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 hover:bg-white/15"><FaApple className="text-xl" /><span>Download on App Store</span></a>
                  <a href="#" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 hover:bg-white/15"><FaGooglePlay className="text-xl" /><span>Get it on Google Play</span></a>
                </div>
                <p className="text-sm text-gray-400"><span className="text-yellow-400">★★★★★</span> 4.9 • 100K+ downloads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
