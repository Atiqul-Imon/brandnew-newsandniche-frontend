import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable Turbopack to avoid runtime issues
  // turbopack: {
  //   rules: {
  //     '*.svg': {
  //       loaders: ['@svgr/webpack'],
  //       as: '*.js',
  //     },
  //   },
  // },
  // Optimize for Render deployment
  output: 'standalone',
  // Server external packages
  serverExternalPackages: ['mongoose'],
  // Image optimization
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default withNextIntl(nextConfig);
