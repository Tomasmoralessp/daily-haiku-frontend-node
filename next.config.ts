import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mivkdigpjiewwtkcxcer.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Añadido el path por si acaso las imagenes estan en el storage
      },
    ],
  },
};

export default nextConfig;