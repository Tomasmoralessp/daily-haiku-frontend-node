import Header from "../components/layout/Header";
import HaikuDisplay from "../components/ui/HaikuDisplay";
import { Metadata } from 'next';
import SubscribeForm from "@/components/ui/SubscribeForm";

interface Haiku {
  id: number;
  haiku: string;
  author: string;
  season: string;
  title?: string | null;
  notes?: string | null;
  source?: string;
  keywords?: string | string[] | null;
  image_url: string;
  date: string;
}

async function getDailyHaiku(): Promise<Haiku | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/haiku/today`, {
    cache: 'no-store',
  });
  return res.ok ? await res.json() : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const haiku = await getDailyHaiku();
  const date = haiku?.date || new Date().toISOString().split('T')[0];
  const fallbackImage = 'https://dailyhaiku.vercel.app/banner/banner.png';
  const imageUrl = haiku?.image_url?.startsWith('http') ? haiku.image_url : fallbackImage;

  return {
    title: `Daily Haiku`,
    description: haiku?.haiku?.slice(0, 140) || 'Discover timeless poetry every day.',
    openGraph: {
      title: `Haiku for ${date}`,
      description: haiku?.haiku || '',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `Haiku for ${date}` }],
      url: `https://dailyhaiku.vercel.app/`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Haiku for ${date}`,
      description: haiku?.haiku || '',
      images: [imageUrl],
    },
  };
}

export default async function Index() {
  const haiku = await getDailyHaiku();

  if (!haiku) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-xl">Error loading today&apos;s haiku</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <HaikuDisplay haiku={haiku} />
        <SubscribeForm />
      </main>
    </div>
  );
}