import Header from "../components/layout/Header";
import HaikuDisplay from "../components/ui/HaikuDisplay";

import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/daily_haiku`, {
    next: { revalidate: 60 },
  })

  const haiku = await res.ok ? await res.json() : null

  const date = haiku?.date || new Date().toISOString().split('T')[0]

  return {
    title: `Haiku for ${date} | Daily Haiku`,
    description: haiku?.haiku?.slice(0, 140) || 'Discover timeless poetry every day.',
    openGraph: {
      title: `Haiku for ${date}`,
      description: haiku?.haiku || '',
      images: [
        {
          url: haiku?.image_url || '/banner/banner.png',
          width: 1200,
          height: 630,
          alt: `Haiku for ${date}`,
        },
      ],
      url: `https://dailyhaiku.vercel.app/`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Haiku for ${date}`,
      description: haiku?.haiku || '',
      images: [haiku?.image_url || '/banner/banner.png'],
    },
  }
}


const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-1 flex flex-col pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-center">
          <HaikuDisplay
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
