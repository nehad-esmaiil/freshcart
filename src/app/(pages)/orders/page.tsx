import OnlineOrderNotice from './OnlineOrderNotice';
import OrderCard from './OrderCard';
import BoxOpenIcon from '@/app/_Components/BoxOpenIcon';
import Link from 'next/link';
import { FaBagShopping } from 'react-icons/fa6';
import { getAllOrders } from '@/api/services/allorders.service';
export default async function Orders({ searchParams }: { searchParams: Promise<{ checkout?: string; order?: string }> }) {
  const { checkout, order } = await searchParams;
  const allOrders = await getAllOrders(checkout === 'complete', typeof order === 'string' ? order : undefined);
  if (!allOrders || (order && !allOrders.some((entry) => entry._id === order))) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p role="alert" className="mt-3 text-gray-600">{allOrders ? 'Your new order is still being synced. Please try again.' : 'Could not load your orders. Please try again.'}</p>
        <Link className="mt-4 inline-block text-green-700 hover:underline" href={order ? "/orders?checkout=complete&order=" + encodeURIComponent(order) : "/orders"}>Try again</Link>
      </section>
    );
  }
  return (
    <>
      <OnlineOrderNotice paidOrderIds={allOrders.filter((order) => order.isPaid && order.paymentMethodType !== 'cash').map((order) => order._id)} />
      {allOrders.length === 0 ? (
        <section>
          <div className="flex items-center justify-center px-4 py-16 sm:py-24 font-medium">
            <div className="max-w-sm text-center">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <BoxOpenIcon className="text-4xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{checkout === 'complete' ? 'Your order is still being synced' : 'No orders yet'}</h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                When you place orders, they&apos;ll appear here
                <br />
                so you can track them.
              </p>
              <Link
                className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white py-3.5 px-8 rounded-xl font-semibold transition-all shadow-lg shadow-green-600/20 w-full sm:w-auto"
                href="/"
              >
                <FaBagShopping />
                Start Shopping
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link className="hover:text-green-600 transition" href="/">
                  Home
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-medium">My Orders</span>
              </nav>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                    <svg aria-hidden="true" className="h-[1em] w-[0.875em] text-2xl text-white" viewBox="0 0 448 512" fill="currentColor">
                      <path d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Track and manage your {allOrders.length} orders
                    </p>
                  </div>
                </div>
                <Link
                  className="self-start sm:self-auto text-green-600 hover:text-green-700 font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-green-50 transition-all text-sm"
                  href="/"
                >
                  <FaBagShopping className="text-xs" /> Continue Shopping
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {allOrders.map((order) => <OrderCard key={order._id} order={order} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
