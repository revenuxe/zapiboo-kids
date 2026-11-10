import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  devIndicators: false,
  async redirects() {
    return [{ source: '/sell-used-car', destination: '/sell/toys', permanent: true }];
  },
  // The Supabase URL and publishable key are intentionally available to the
  // browser client. Vercel does not require the NEXT_PUBLIC_ prefix when a
  // value is explicitly passed through this configuration.
  env: {
    NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
  async headers() {
    return [{
      source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ]
    }];
  },
};

export default nextConfig;
