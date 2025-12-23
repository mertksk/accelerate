/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  output: "standalone",
  serverExternalPackages: ['snarkjs', 'circomlibjs'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'child_process': 'commonjs child_process',
      });
    }
    return config;
  },
};

export default nextConfig;
