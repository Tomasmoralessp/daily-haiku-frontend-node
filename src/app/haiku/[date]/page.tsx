import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import HaikuDate from '@/components/ui/HaikuDate'

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = params

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/haiku/${date}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) notFound()

  const haiku = await res.json()

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 flex flex-col pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-center">
          <HaikuDate date={date} haiku={haiku} />
        </div>
      </main>
    </div>
  )
}
