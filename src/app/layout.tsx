import "./globals.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Daily Haiku',
    default: 'Daily Haiku',
  },
  description: 'Descubre un haiku diario, poesía atemporal de Bashō y más allá.',
  metadataBase: new URL('https://dailyhaiku.vercel.app'),
  openGraph: {
    title: 'Daily Haiku 🌸',
    description: 'Descubre un haiku diario, poesía atemporal de Bashō y más allá.',
    images: ['/banner/banner.png'],
    url: 'https://dailyhaiku.vercel.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Haiku 🌸',
    description: 'Descubre un haiku diario, poesía atemporal de Bashō y más allá.',
    images: ['https://dailyhaiku.vercel.app/banner/banner.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
