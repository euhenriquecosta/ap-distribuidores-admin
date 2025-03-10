import type { NextConfig } from "next";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['/src/@'] = path.join(__dirname, 'src');
    config.resolve.alias['/lib/utils'] = path.join(__dirname, 'src/lib/utils');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.appro.com.br',
        pathname: '/uploads/**', // A parte do caminho do arquivo, pode ser mais específica dependendo do seu caso
      },
    ],
  },
};

export default nextConfig;