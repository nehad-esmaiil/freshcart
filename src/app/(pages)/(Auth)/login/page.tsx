'use client';
import { useState } from 'react';
import image3 from '../../../../assets/images/image3.png';
import Image from 'next/image';
import { FaTruck } from 'react-icons/fa';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa6';
import { FaFacebook } from 'react-icons/fa';
import { IoLockClosed } from 'react-icons/io5';
import { FaUsers } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { SpinnerCustom } from '@/app/_Components/ButtonSpinner/ButtonSpinner';
import Link from 'next/link';
import { LoginSchema, LoginSchemaType } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa6';
import { FaEyeSlash } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

const inputClass = "w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-12 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  });
  const { handleSubmit } = form;
  async function mySubmit(data: LoginSchemaType) {
    setLoading(true);
    const requestedPath = new URLSearchParams(window.location.search).get('callbackUrl');
    const callbackUrl = requestedPath && /^(?:\/orders$|\/wishlist$|\/cart$|\/profile(?:\/|\?|$))/.test(requestedPath) && !requestedPath.includes('\\')
      ? requestedPath
      : '/';
    const response = await signIn('credentials', { ...data, redirect: false, callbackUrl });
    if (response?.ok) {
      toast.success('Login successful');
      setTimeout(() => {
        window.location.assign(callbackUrl);
      }, 1500);
    } else {
      toast.error(response?.error || 'Unable to sign in');
    }
    setLoading(false);
  }
  return (
    <>
      <section id="login-section" className="font-medium">
        <div className="container py-16 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="hidden lg:block">
              <div className="text-center space-y-6">
                <Image
                  src={image3}
                  alt="login image"
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    FreshCart - Your One-Stop Shop for Fresh Products
                  </h2>
                  <p className="text-lg text-gray-600">
                    Join thousands of happy customers who trust FreshCart for their daily grocery
                    needs
                  </p>
                  <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaTruck className="text-green-600 mr-2" /> Free Delivery
                    </div>
                    <div className="flex items-center">
                      <FaShieldAlt className="text-green-600 mr-2" /> Secure Payment
                    </div>
                    <div className="flex items-center">
                      <MdOutlineAccessTimeFilled className="text-green-600 mr-2" /> 24/7 Support
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-green-600">
                      Fresh<span className="text-gray-800">Cart</span>
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                  <p className="text-gray-600">
                    Sign in to continue your fresh shopping experience
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                  >
                    <FaGoogle className="text-red-600 text-lg" />
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                  >
                    <FaFacebook className="text-blue-600 text-lg" />
                    <span className="font-medium text-gray-700">Continue with Facebook</span>
                  </button>
                </div>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      OR CONTINUE WITH EMAIL
                    </span>
                  </div>
                </div>
                <form onSubmit={handleSubmit(mySubmit)} className="space-y-6" noValidate>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="relative">
                      <MdEmail aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                      <input {...form.register('email')} id="email" type="email" autoComplete="email" aria-invalid={!!form.formState.errors.email} placeholder="Enter your email" className={inputClass} />
                    </div>
                    {form.formState.errors.email && <p role="alert" className="mt-2 text-sm text-red-600">{form.formState.errors.email.message}</p>}
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                      <Link className="text-sm font-medium text-green-600 hover:text-green-700" href="/forget-password">Forgot Password?</Link>
                    </div>
                    <div className="relative">
                      <IoLockClosed aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                      <input {...form.register('password')} id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" aria-invalid={!!form.formState.errors.password} placeholder="Enter your password" className={inputClass + ' pr-12'} />
                      <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {form.formState.errors.password && <p role="alert" className="mt-2 text-sm text-red-600">{form.formState.errors.password.message}</p>}
                  </div>
                  <label className="flex items-center">
                    <input type="checkbox" name="rememberMe" className="size-4 rounded border-2 border-gray-300 accent-green-600 focus:ring-green-500" />
                    <span className="ml-3 text-sm text-gray-700">Keep me signed in</span>
                  </label>
                  <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-green-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50">
                    {loading && <SpinnerCustom />}
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
                <div className="text-center mt-8 pt-6 border-t border-gray-100">
                  <p className="text-gray-600">
                    New to FreshCart?{' '}
                    <Link
                      className="text-green-600 hover:text-green-700 ms-2 font-semibold cursor-pointer"
                      href="/register"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-gray-500">
                  <div className="flex items-center">
                    <IoLockClosed className="mr-1" />
                    SSL Secured
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-1" />
                    50K+ Users
                  </div>
                  <div className="flex items-center">
                    <FaStar className="mr-1" />
                    4.9 Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
