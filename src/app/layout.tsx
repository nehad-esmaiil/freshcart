import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Exo } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Navbar from './_Components/Navbar/Navbar';
import Footer from './_Components/Footer/Footer';
import ScrollToPageTop from './_Components/ScrollToPageTop';
import MyProvider from './_Components/MyProvider/MyProvider';
import CartContextProvider from '../context/CartContext';
import WishlistContextProvider from '../context/WishListContext';
const exo = Exo({
  variable: '--font-exo',
  subsets: ['latin'],
});
export const metadata: Metadata = {
  title: 'FreshCart',
  description: 'Shop products, explore brands and categories, and manage your orders on FreshCart.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${exo.className} ${exo.variable} antialiased`}>
        <MyProvider>
          <CartContextProvider>
            <WishlistContextProvider>
              <Navbar />
              <ToastContainer position="top-right" autoClose={1800} />
              {children}
              <Suspense fallback={null}>
                <ScrollToPageTop />
              </Suspense>
              <Footer />
            </WishlistContextProvider>
          </CartContextProvider>
        </MyProvider>
      </body>
    </html>
  );
}
