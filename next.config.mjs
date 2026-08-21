/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['googleapis'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'sharp'];
    return config;
  },
};
export default nextConfig;
