/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ ADD THIS PART
  images: {
    domains: ['edtrlownbrwnzduvrhko.supabase.co'],
  },
};

module.exports = nextConfig;