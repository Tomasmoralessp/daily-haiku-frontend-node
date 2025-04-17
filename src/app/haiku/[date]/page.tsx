import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import HaikuDate from '@/components/ui/HaikuDate';
import { Haiku } from '@/lib/haiku';

interface PageProps {
  params: Promise<{ date: string }>;
}

/*──────────────── generateMetadata ────────────────*/
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { date } = await params;

  // 1 · Fetch the haiku for this date
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/haiku/${date}`,
    { next: { revalidate: 3600 } } // cache for 1 h
  );
  const haiku: Haiku | null = res.ok ? await res.json() : null;

  // 2 · Choose the image (fallback if missing)
  const fallbackImg = 'https://dailyhaiku.vercel.app/banner/banner.png';
  const img = haiku?.image_url?.startsWith('http')
    ? haiku.image_url
    : fallbackImg;

  // 3 · Keep any images coming from parent layouts
  const prev = (await parent).openGraph?.images ?? [];
  const prevOG = prev.map((i) =>
    typeof i === 'string' ? { url: i } : i
  );

  // 4 · Return metadata
  return {
    title: `Haiku for ${date} | Daily Haiku`,
    description:
      haiku?.haiku?.slice(0, 140) ??
      'Discover timeless poetry every day.',
    openGraph: {
      title: `Haiku for ${date}`,
      description: haiku?.haiku ?? '',
      images: [
        { url: img, width: 1200, height: 630, alt: `Haiku for ${date}` },
        ...prevOG,
      ],
      type: 'article',
      url: `https://dailyhaiku.vercel.app/haiku/${date}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Haiku for ${date}`,
      description: haiku?.haiku ?? '',
      images: [img],
    },
  };
}

/*──────────────── Page component ──────────────────*/
export default async function Page(props: PageProps) {
  const { date } = await props.params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/haiku/${date}`,
    { next: { revalidate: 60 } } // short cache for page content
  );

  if (!res.ok) notFound(); // triggers Next.js 404

  const haiku: Haiku = await res.json();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 flex flex-col pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-center">
          <HaikuDate date={date} haiku={haiku} />
        </div>
      </main>
    </div>
  );
}
