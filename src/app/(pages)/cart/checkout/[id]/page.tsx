'use client';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import { useState, useContext, useEffect } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaReceipt } from 'react-icons/fa';
import { GoHomeFill } from 'react-icons/go';
import { FaCheck } from 'react-icons/fa6';
import { IoMdInformationCircle } from 'react-icons/io';
import { FaCity } from 'react-icons/fa';
import { cheackoutSchema, cheackoutSchemaType } from '@/schemas/checkout.schema';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa6';
import { FaWallet } from 'react-icons/fa';
import { RiCashFill } from 'react-icons/ri';
import Image from 'next/image';
import imageVisa from '@/assets/images/visa.png';
import imageMasterCard from '@/assets/images/masterCard.png';
import imageAMEX from '@/assets/images/amex.png';
import { FaShieldAlt } from 'react-icons/fa';
import { cashOrder, onlinPayment } from '@/actions/checkout.action';
import { useParams, useRouter } from 'next/navigation';
import { CartContext } from '@/context/CartContext';
import { getLoggedUserCart } from '@/actions/addToCart.action';
import { cartData } from '@/api/types/cart.type';
import { toast } from 'react-toastify';
import { getAllOrders } from '@/api/services/allorders.service';
import OrdersLoading from '@/app/(pages)/orders/loading';

export default function CheackOut() {
  const router = useRouter();

  const { setnumOfCartItems } = useContext(CartContext);
  const { id }: { id: string } = useParams();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [cartData, setCartData] = useState<null | cartData>(null);

  useEffect(() => {
    async function fetchCart() {
      const res = await getLoggedUserCart();
      if (res.status === 'success') {
        setCartData(res.data);
      }
      console.log(res.data);
    }

    fetchCart();
  }, []);
  const form = useForm<cheackoutSchemaType>({
    defaultValues: {
      details: '',
      phone: '',
      city: '',
    },
    resolver: zodResolver(cheackoutSchema),
  });
  const { handleSubmit } = form;
  async function mySubmit(data: cheackoutSchemaType) {
    setLoading(true);
    try {
      if (paymentMethod === 'cash') {
        const res = await cashOrder(id, data);
        if (res.status !== 'success') {
          toast.error('Could not place your order. Please try again.');
          setLoading(false);
          return;
        }

        setnumOfCartItems(0);
        setOrderPlaced(true);
        toast.success('Order placed successfully!');
        const query = new URLSearchParams({ checkout: 'complete' });
        if (typeof res.data?._id === 'string') query.set('order', res.data._id);
        router.replace('/orders?' + query);
        return;
      }

      const previousOrders = await getAllOrders();
      const res = await onlinPayment(id, data);
      if (res.status === 'success' && res.session?.url) {
        if (previousOrders) {
          sessionStorage.setItem('pending-online-order', JSON.stringify(previousOrders.map((order) => order._id)));
        }
        window.location.assign(res.session.url);
        return;
      }
    } catch {
      // Keep the checkout form available for retry after a failed request.
    }
    toast.error(paymentMethod === 'cash'
      ? 'Could not place your order. Please try again.'
      : 'Could not start online checkout. Please try again.');
    setLoading(false);
  }

  if (orderPlaced) return <OrdersLoading />;

  return (
    <>
      <section className="bg-linear-to-b from-gray-50 to-white min-h-screen py-8 font-medium">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link className="hover:text-green-600 transition" href="/">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <Link className="hover:text-green-600 transition" href="/cart">
                Cart
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Checkout</span>
            </nav>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="bg-linear-to-br from-[#16a34a] to-[#15803d] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
                    <FaReceipt />
                  </span>
                  Complete Your Order
                </h1>
                <p className="text-gray-500 mt-2">Review your items and complete your purchase</p>
              </div>
              <Link
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition-all"
                href="/cart"
              >
                <FaArrowLeftLong /> Back to Cart
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit(mySubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="bg-linear-to-r from-[#16a34a] to-[#15803d] px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <GoHomeFill />
                      Shipping Address
                    </h2>
                    <p className="text-green-100 text-sm mt-1">
                      Where should we deliver your order?
                    </p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <IoMdInformationCircle className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Delivery Information</p>
                        <p className="text-xs text-blue-600 mt-0.5">
                          Please ensure your address is accurate for smooth delivery
                        </p>
                      </div>
                    </div>
                    <div className="relative flex flex-col gap-2">
                      <div className="absolute left-4 top-10 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FaCity className="text-sm text-gray-500" />
                      </div>
                      <Controller
                        name="city"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field className="gap-2" data-invalid={fieldState.invalid}>
                            <FieldLabel className="font-medium text-gray-700" htmlFor="city">
                              City<span className="text-red-500">*</span>
                            </FieldLabel>
                            <input
                              {...field}
                              id="city"
                              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 pl-14 text-base transition-all focus:border-[#22c55e] focus:outline-none focus:ring-2 focus:ring-[#dcfce7]"
                              aria-invalid={fieldState.invalid}
                              placeholder="e.g. Cairo, Alexandria, Giza"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                    <div className="relative flex flex-col gap-2">
                      <div className="absolute left-4 top-10 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FaMapMarkerAlt className="text-sm text-gray-500" />
                      </div>
                      <Controller
                        name="details"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field className="gap-2" data-invalid={fieldState.invalid}>
                            <FieldLabel className="font-medium text-gray-700" htmlFor="details">
                              Street Address <span className="text-red-500">*</span>
                            </FieldLabel>
                            <textarea rows={3}
                              {...field}
                              id="details"
                              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 pl-14 text-base transition-all focus:border-[#22c55e] focus:outline-none focus:ring-2 focus:ring-[#dcfce7] resize-none"
                              aria-invalid={fieldState.invalid}
                              placeholder="Street name, building number, floor, apartment..."
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                    <div className="relative flex flex-col gap-2">
                      <div className="absolute left-4 top-10 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FaPhone className="text-sm text-gray-500" />
                      </div>
                      <span className="pointer-events-none absolute right-4 top-12 hidden text-xs sm:block text-gray-400">
                        Egyptian numbers only
                      </span>
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field className="gap-2" data-invalid={fieldState.invalid}>
                            <FieldLabel className="font-medium text-gray-700" htmlFor="phone">
                              Phone Number <span className="text-red-500">*</span>
                            </FieldLabel>
                            <input
                              {...field}
                              id="phone"
                              type="tel"
                              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 pl-14 text-base transition-all focus:border-[#22c55e] focus:outline-none focus:ring-2 focus:ring-[#dcfce7] sm:pr-40"
                              aria-invalid={fieldState.invalid}
                              placeholder="01xxxxxxxxx"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="bg-linear-to-r from-[#16a34a] to-[#15803d] px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <FaWallet />
                      Payment Method
                    </h2>
                    <p className="text-green-100 text-sm mt-1">Choose how you&apos;d like to pay</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full p-5 cursor-pointer rounded-xl border-2 flex items-center gap-4 transition-all
    ${
      paymentMethod === 'cash'
        ? 'border-green-500 bg-green-50'
        : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
    }
  `}
                    >
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all
    ${
      paymentMethod === 'cash'
        ? 'bg-green-100 text-green-400 group-hover:bg-green-200'
        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
    }
  `}
                      >
                        <RiCashFill />
                      </div>
                      <div className="flex-1 text-left">
                        <h3
                          className={`${paymentMethod === 'cash' ? 'font-bold text-gray-900' : 'font-bold text-green-900'}`}
                        >
                          Cash on Delivery
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Pay when your order arrives at your doorstep
                        </p>
                      </div>
                      {paymentMethod === 'cash' ? (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all bg-green-600 text-white">
                          <FaCheck className="text-xs" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all border-2 border-gray-200"></div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`w-full p-5 cursor-pointer rounded-xl border-2 flex items-center gap-4 transition-all
    ${
      paymentMethod === 'online'
        ? 'border-green-500 bg-green-50'
        : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
    }
  `}
                    >
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all
    ${
      paymentMethod === 'online'
        ? 'bg-green-100 text-green-400 group-hover:bg-green-200'
        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
    }
  `}
                      >
                        <RiCashFill />
                      </div>
                      <div className="flex-1 text-left">
                        <h3
                          className={`${paymentMethod === 'online' ? 'font-bold text-gray-900' : 'font-bold text-green-900'}`}
                        >
                          Pay Online
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Secure payment with Credit/Debit Card via Stripe
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Image className="h-5 w-5" src={imageVisa} alt="Visa" />
                          <Image className="h-5 w-5" src={imageMasterCard} alt="Mastercard" />
                          <Image className="h-5 w-5" src={imageAMEX} alt="Amex" />
                        </div>
                      </div>
                      {paymentMethod === 'online' ? (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all bg-green-600 text-white">
                          <FaCheck className="text-xs" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all border-2 border-gray-200"></div>
                      )}
                    </button>
                    <div className="flex items-center gap-3 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 mt-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <FaShieldAlt className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">Secure & Encrypted</p>
                        <p className="text-xs text-green-600 mt-0.5">
                          Your payment info is protected with 256-bit SSL encryption
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CheckoutOrderSummary cartData={cartData} paymentMethod={paymentMethod} loading={loading} />
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
