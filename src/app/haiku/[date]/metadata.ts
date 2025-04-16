import { Metadata } from 'next'

type Props = {
  params: { date: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = params

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/haiku/${date}`, {
      cache: 'force-cache',
    })

    if (!res.ok) throw new Error('No se pudo obtener el haiku')

    const haiku = await res.json()

    const fallbackImage = 'https://dailyhaiku.vercel.app/banner/banner.png'
    const imageUrl = haiku?.image_url?.startsWith('http')
      ? haiku.image_url
      : fallbackImage

    return {
      title: haiku?.title || `Haiku for ${date} | Daily Haiku`,
      description: haiku?.haiku?.slice(0, 140) || `Discover a haiku for ${date}`,
      openGraph: {
        title: `Haiku for ${date}`,
        description: haiku?.haiku || '',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Haiku ${date}`,
          },
        ],
        type: 'article',
        url: `https://dailyhaiku.vercel.app/haiku/${date}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `Haiku for ${date}`,
        description: haiku?.haiku || '',
        images: [imageUrl],
      },
    }
  } catch (err) {
    console.error('Metadata generation failed:', err)
    return {
      title: `${date} | Daily Haiku`,
      description: `Haiku publicado el ${date}.`,
    }
  }
}
