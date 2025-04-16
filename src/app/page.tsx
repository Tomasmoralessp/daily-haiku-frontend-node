import Header from "../components/layout/Header"
import HaikuDisplay from "../components/ui/HaikuDisplay"
import { Metadata } from 'next'

interface Haiku {
  id: number
  haiku: string
  author: string
  season: string
  title?: string | null
  notes?: string | null
  source?: string
  keywords?: string | string[] | null
  image_url: string
  date: string
}

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/daily_haiku`, {
    cache: 'force-cache',
  })

  const haiku = await res.ok ? await res.json() : null
  const date = haiku?.date || new Date().toISOString().split('T')[0]
  const fallbackImage = 'https://dailyhaiku.vercel.app/banner/banner.png'
  const imageUrl = haiku?.image_url?.startsWith('http') ? haiku.image_url : fallbackImage

  return {
    title: `Haiku for ${date} | Daily Haiku`,
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
  }
}

export default async function Index() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/daily_haiku`, {
    cache: 'force-cache',
  })

  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
          <p className="text-xl">Error loading today&apos;s haiku</p>
      </div>
    )
  }

  const haiku: Haiku = await res.json()

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 flex flex-col pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-center">
          <HaikuDisplay haiku={haiku} />
        </div>
      </main>
    </div>
  )
}
