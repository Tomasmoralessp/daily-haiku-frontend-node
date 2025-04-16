import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const ClientHaikuPage = dynamic(() => import('./ClientHaikuPage'), { ssr: false })

export async function generateMetadata({ params }: { params: { date: string } }): Promise<Metadata> {
  const { date } = params
  const prettyDate = new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return {
    title: `${prettyDate} | Daily Haiku`,
    description: `Haiku publicado el ${prettyDate}. Descubre un nuevo poema cada día.`,
    openGraph: {
      title: `Haiku para el ${prettyDate} | Daily Haiku`,
      description: `Descubre el haiku diario, poesía atemporal de Bashō y más allá.`,
      url: `https://dailyhaiku.vercel.app/haiku/${date}`,
      images: [
        {
          url: `https://dailyhaiku.vercel.app/banner/haiku_${date}.png`,
          width: 1200,
          height: 630,
          alt: `Haiku del ${prettyDate}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Haiku para el ${prettyDate}`,
      description: 'Descubre poesía japonesa todos los días.',
      images: [`https://dailyhaiku.vercel.app/banner/haiku_${date}.png`],
    },
  }
}

export default function Page() {
  return <ClientHaikuPage />
}
