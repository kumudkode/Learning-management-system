import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'randomuser.me',
      'via.placeholder.com',
      'example.com',
      'meet.example.com',
      'recordings.example.com',
      // Add your actual production domains here
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Enable server actions if needed
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  // Configure redirects for authentication paths
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
  // If you need to configure headers (e.g., for security)
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Define environment variables that should be available to the browser
  env: {
    APP_NAME: 'EduFlow LMS',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  },
  // Configure webpack if needed
  webpack: (config) => {
    // Add custom webpack configurations here if needed
    return config;
  },
};

export default nextConfig;