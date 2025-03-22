/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is no longer needed as it's enabled by default in newer Next.js versions
  images: {
    domains: [
      'randomuser.me',  // For user avatars in our mock data
      'via.placeholder.com', // For placeholder images
      'example.com',    // For sample course images and recordings
      'meet.example.com',
      'recordings.example.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Fix the serverActions format to be an object with enabled property
    serverActions: {
      enabled: true
    },
    // Add Turbopack configuration to address the warning
    turbo: {}
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
  // Configure webpack if needed - consider removing if using Turbopack
  webpack: (config, { isServer }) => {
    // Add custom webpack configurations here if needed
    return config;
  },
};

module.exports = nextConfig;