import { Metadata } from 'next'

type Props = {
  params: { date: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = params

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/haiku/${date}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error('No se pudo obtener el haiku')

    const haiku = await res.json()

    return {
      title: `${date} | Daily Haiku`,
      description: haiku.haiku
        ? haiku.haiku.slice(0, 140)
        : `Haiku publicado el ${date}. Descubre un nuevo poema cada día.`,
      openGraph: {
        title: `Haiku del ${date}`,
        description: haiku.haiku || 'Descubre poesía japonesa todos los días.',
        url: `https://dailyhaiku.vercel.app/haiku/${date}`,
        images: [
          {
            url: haiku.image_url || `https://dailyhaiku.vercel.app/haiku_${date}.png`,
            width: 1200,
            height: 630,
            alt: `Haiku del ${date}`,
          },
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Haiku para el ${date}`,
        description: haiku.haiku || 'Descubre poesía japonesa todos los días.',
        images: [haiku.image_url || `https://dailyhaiku.vercel.app/banner/haiku_${date}.png`],
      },
    }
  } catch (err) {
    console.error('Error generando metadata:', err)
    return {
      title: `${date} | Daily Haiku`,
      description: `Haiku del ${date}.`,
    }
  }
}
