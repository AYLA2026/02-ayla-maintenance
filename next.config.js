/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        "node:fs": false,
        https: false,
        "node:https": false,
        http: false,
        "node:http": false,
        path: false,
        stream: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;