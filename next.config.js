/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // تجاهل كل node: modules في المتصفح
      config.resolve.alias = {
        ...config.resolve.alias,
        "node:fs": false,
        "node:https": false,
        "node:http": false,
        "node:path": false,
        "node:stream": false,
        "node:crypto": false,
        "node:util": false,
        "node:zlib": false,
        "node:buffer": false,
        "node:net": false,
        "node:tls": false,
        "node:url": false,
        "node:querystring": false,
        "node:os": false,
        "node:assert": false,
        "node:constants": false,
        "node:events": false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;