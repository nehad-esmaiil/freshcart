'use client';
import NavbarIcon from './NavbarIcons';
import NavbarSearch from './NavbarSearch';
import { useContext, useEffect, useRef, useState } from 'react';
import logo from '../../../assets/images/freshcart-logo.svg';
import Link from 'next/link';
import Image from 'next/image';
import { FaRightFromBracket } from 'react-icons/fa6';
import BoxOpenIcon from '@/app/_Components/BoxOpenIcon';
import { FaRegHeart, FaRegUser } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { FaRegAddressBook } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { signOut, useSession } from 'next-auth/react';
import { FaRegUserCircle } from 'react-icons/fa';
import { CartContext } from '@/context/CartContext';
import { WishlistContext } from '@/context/WishListContext';

export default function Navbar() {
  const { numOfCartItems } = useContext(CartContext);
  const { numOfWishlistItems } = useContext(WishlistContext);
  const { data: myData, status } = useSession();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenu = useRef<HTMLDivElement>(null);
  const accountButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!accountOpen) return;
    function closeOutside(event: PointerEvent) {
      if (!accountMenu.current?.contains(event.target as Node)) setAccountOpen(false);
    }
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [accountOpen]);

  function mySignOut() {
    signOut({ redirect: true, callbackUrl: '/login' });
  }
  return (
    <>
      <header className="sticky top-0 z-40 bg-white font-medium shadow-sm [font-family:var(--font-exo)]">
        <div className="hidden lg:block border-b border-gray-100 text-sm font-medium">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-10 text-gray-500">
              <div className="flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <NavbarIcon name="Truck" className="text-green-600 text-xs" />
                  Free Shipping on Orders 500 EGP
                </div>
                <div className="flex items-center gap-2">
                  <NavbarIcon name="Gift" className="text-green-600 text-xs" />
                  New Arrivals Daily
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <a
                    href="tel:+1 (800) 123-4567"
                    className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <NavbarIcon name="Phone" />
                    <span>+1 (800) 123-4567</span>
                  </a>
                  <a
                    href="mailto:support@freshcart.com"
                    className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <NavbarIcon name="Envelope" />
                    <span>support@freshcart.com</span>
                  </a>
                </div>
                <span className="w-px h-4 bg-gray-200"></span>
                <div className="flex items-center gap-4">
                  {status === 'unauthenticated' ? (
                    <>
                      <Link
                        className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition-colors"
                        href="/login"
                      >
                        <NavbarIcon name="User" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition-colors"
                        href="/register"
                      >
                        <NavbarIcon name="UserPlus" />
                        <span>Sign Up</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition-colors"
                        href="/profile"
                      >
                        <NavbarIcon name="User" className="text-xs" />
                        <span>{myData?.user?.name}</span>
                      </Link>
                      <button
                        onClick={mySignOut}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <FaRightFromBracket className="text-xs" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4 lg:gap-8">
              <Link href="/" className="shrink-0">
                <Image className="h-6 w-auto lg:h-8" src={logo} alt="FreshCart" width={160} height={31} />
              </Link>
              <NavbarSearch />
              <nav className="hidden items-center gap-6 xl:flex">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-[#16a34a] font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-[#16a34a] font-medium transition-colors"
                >
                  Shop
                </Link>
                <div className="group relative">
                  <button type="button" className="flex cursor-pointer items-center gap-1.5 py-2 font-medium text-gray-700 transition-colors hover:text-[#16a34a]">
                    Categories
                    <FaChevronDown aria-hidden className="h-2.5 w-3.125 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                  </button>
                  <div className="invisible absolute top-full left-0 pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[200px] rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                      {[
                        { label: 'All Categories', href: '/categories' },
                        { label: 'Electronics', href: '/products?category=6439d2d167d9aa4ca970649f' },
                        { label: "Women's Fashion", href: '/products?category=6439d58a0049ad0b52b9003f' },
                        { label: "Men's Fashion", href: '/products?category=6439d5b90049ad0b52b90048' },
                        { label: 'Beauty & Health', href: '/products?category=6439d30b67d9aa4ca97064b1' },
                      ].map(({ label, href }) => (
                        <Link key={href} href={href} onClick={(event) => event.currentTarget.blur()} className="block px-4 py-2.5 text-gray-600 transition-colors hover:bg-[#f0fdf4] hover:text-[#16a34a]">
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link
                  href="/brands"
                  className="text-gray-700 hover:text-[#16a34a] font-medium transition-colors"
                >
                  Brands
                </Link>
              </nav>
              <div className="flex items-center gap-1 lg:gap-2">
                <Link
                  href="/contact"
                  className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center">
                    <NavbarIcon name="Headset" className="w-5 text-[#16a34a]" />
                  </div>
                  <div className="text-xs">
                    <div>
                      <div className="text-gray-400">Support</div>
                      <div className="font-semibold text-gray-700">24/7 Help</div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/wishlist" title="Wishlist" aria-label="Wishlist"
                  className="group relative inline-block rounded-full p-2.5 transition-colors hover:bg-gray-100 [&>svg]:inline-block [&>svg]:align-[-0.125em]"
                >
                  <NavbarIcon name="Heart" className="w-6.25 text-xl text-gray-500 group-hover:text-[#16a34a] transition-colors" />
                  {numOfWishlistItems > 0 && (
                    <span className="absolute top-0.5 right-0.5 size-4.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {numOfWishlistItems}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart" title="Cart" aria-label="Cart"
                  className="group relative inline-block rounded-full p-2.5 transition-colors hover:bg-gray-100 [&>svg]:inline-block [&>svg]:align-[-0.125em]"
                >
                  <NavbarIcon name="Cart" className="text-xl text-gray-500 group-hover:text-[#16a34a] transition-colors" />
                  {numOfCartItems > 0 && (
                    <span className="absolute top-0.5 right-0.5 size-4.5 rounded-full bg-[#16a34a] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {numOfCartItems}
                    </span>
                  )}
                </Link>
                {status === 'unauthenticated' ? (
                  <>
                    <Link
                      href="/login"
                      className="hidden lg:flex items-center gap-2 ml-2 px-5 py-2.5 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold transition-colors shadow-sm shadow-[#16a34a]/20"
                    >
                      <NavbarIcon name="User" />
                      Sign In
                    </Link>
                  </>
                ) : (
                  <>
                    <div ref={accountMenu} className="relative hidden lg:block" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setAccountOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape" && accountOpen) { setAccountOpen(false); accountButton.current?.focus(); } }}>
                      <button ref={accountButton} type="button" aria-label="Account" aria-expanded={accountOpen} aria-controls="account-dropdown" onClick={() => setAccountOpen(!accountOpen)} className="group relative cursor-pointer rounded-full p-2.5 transition-colors hover:bg-gray-100">
                        <FaRegUserCircle className="inline-block h-5 w-6.25 align-[-0.125em] text-xl text-gray-500 group-hover:text-[#16a34a] transition-colors" />
                      </button>
                      <div id="account-dropdown" inert={!accountOpen} className={"absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-200 " + (accountOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0")}>
                        <div>
                          <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
                              <FaRegUserCircle className="text-xl" />
                            </span>
                            <div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-800">{myData?.user?.name}</p><p className="truncate text-xs text-gray-400">{myData?.user?.email}</p></div>
                          </div>
                          <div className="py-2">
                            {[
                              { label: 'My Profile', href: '/profile', Icon: FaRegUser },
                              { label: 'My Orders', href: '/orders', Icon: BoxOpenIcon },
                              { label: 'My Wishlist', href: '/wishlist', Icon: FaRegHeart },
                              { label: 'Addresses', href: '/profile/addresses', Icon: FaRegAddressBook },
                              { label: 'Settings', href: '/profile/settings', Icon: FaGear },
                            ].map(({ label, href, Icon }) => (
                              <Link key={href} href={href} onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-[#f0fdf4] hover:text-[#16a34a]"
                              >
                                <Icon className="size-auto w-4 text-gray-400" />
                                {label}
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="border-t border-gray-100 py-2">
                          <button type="button" onClick={mySignOut} className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50">
                            <FaRightFromBracket className="w-4 text-red-500!" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <Sheet>
                  <SheetTrigger className="lg:hidden cursor-pointer ml-1 w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors">
                    <NavbarIcon name="Bars" />
                  </SheetTrigger>
                  <SheetContent className="lg:hidden w-80! right-0! max-w-[85vw] overflow-y-auto! gap-0! bg-white! shadow-2xl! text-base! font-medium [font-family:var(--font-exo)]">
                    <SheetHeader className="border-b border-gray-100 bg-gray-50/50">
                      <SheetTitle>
                        <Image className="h-8 w-auto" src={logo} alt="FreshCart" />
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col px-4">
                      <form className="flex flex-1 max-w-2xl py-4 border-b border-gray-100">
                        <div className="relative w-full">
                          <input
                            type="text"
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                            placeholder="Search products..."
                          />
                          <button type="submit" aria-label="Search products" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors">
                            <NavbarIcon name="Search" />
                          </button>
                        </div>
                      </form>
                      <nav>
                        <div className="space-y-1 flex flex-col py-4">
                          <SheetClose>
                            <Link
                              href="/"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                              Home
                            </Link>
                          </SheetClose>
                          <SheetClose>
                            <Link
                              href="/products"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                              Shop
                            </Link>
                          </SheetClose>
                          <SheetClose>
                            <Link
                              href="/categories"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                              Categories
                            </Link>
                          </SheetClose>

                          <SheetClose>
                            <Link
                              href="/brands"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                              Brands
                            </Link>
                          </SheetClose>
                        </div>
                      </nav>
                      <div className="mx-4 border-t border-gray-100"></div>
                      <div className="flex flex-col space-y-1 py-4">
                        <SheetClose>
                          <Link
                            href="/wishlist"
                            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                                <NavbarIcon name="Heart" className="text-red-500 text-lg" />
                              </div>
                              <span className="font-medium text-gray-700">Wishlist</span>
                            </div>
                          </Link>
                        </SheetClose>
                        <SheetClose>
                          <Link
                            href="/cart"
                            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-md">
                                <NavbarIcon name="Cart" className="text-[#16a34a]" />
                              </div>
                              <span className="font-medium text-gray-700">Cart</span>
                            </div>
                          </Link>
                        </SheetClose>
                      </div>
                      {status === 'unauthenticated' ? (
                        <>
                          <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-6 pb-4">
                              <SheetClose className="flex items-center cursor-pointer justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
                                <Link href="/login">Sign In</Link>
                              </SheetClose>
                              <SheetClose className="flex items-center cursor-pointer justify-center gap-2 px-4 py-3 rounded-xl border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 transition-colors">
                                <Link href="/register">Sign Up</Link>
                              </SheetClose>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col space-y-1 border-t border-gray-100 py-4">
                            <SheetClose>
                              <Link
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                                href="/profile"
                              >
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                  <NavbarIcon name="User" className="text-gray-500" />
                                </div>
                                <span className="font-medium text-gray-700">
                                  {myData?.user?.name}
                                </span>
                              </Link>
                            </SheetClose>
                            <SheetClose>
                              <button
                                onClick={mySignOut}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                              >
                                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                                  <FaRightFromBracket className="text-red-500" />
                                </div>
                                <span className="font-medium text-red-600">Sign Out</span>
                              </button>
                            </SheetClose>
                          </div>
                        </>
                      )}
                      <SheetClose>
                        <Link
                          href="/contact"
                          className="mt-2 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:bg-green-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <NavbarIcon name="Headset" className="text-lg text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-start text-gray-700">
                              Need Help?
                            </div>
                            <div className="text-sm text-green-600">Contact Support</div>
                          </div>
                        </Link>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
