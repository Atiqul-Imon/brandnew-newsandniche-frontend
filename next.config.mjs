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
  // Memory optimization settings
  experimental: {
    // Optimize bundle size
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  // Compiler optimization
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Memory optimization for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },
  // Memory limits
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default withNextIntl(nextConfig);
