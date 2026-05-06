/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: { domains: ['media.licdn.com', 'avatars.githubusercontent.com'] },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

module.exports = nextConfig;
