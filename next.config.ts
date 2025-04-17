import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Desactivamos esto para evitar problemas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mivkdigpjiewwtkcxcer.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizeCss: false, // Desactivamos la optimización CSS que usa LightningCSS
    disablePostcssPresetEnv: true, // Deshabilitamos el preset de PostCSS que puede causar conflictos
  },
};

export default nextConfig;