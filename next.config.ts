import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/wish-list', destination: '/wishlist', permanent: false },
      { source: '/singleSubcategories/:id', destination: '/products?subcategory=:id', permanent: false },
      { source: '/forget-password/otp', destination: '/forget-password', permanent: false },
      { source: '/forget-password/new-password', destination: '/forget-password', permanent: false },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        pathname: '/Route-Academy-products/**',
      },
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        pathname: '/Route-Academy-categories/**',
      },
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        pathname: '/Route-Academy-brands/**',
      },
    ],
  },
};

export default nextConfig;
