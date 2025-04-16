export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = 'https://dailyhaiku.vercel.app'

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/haiku/history`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch haiku history: ${res.status}`)
    }

    const data: { date: string }[] = await res.json()

    // 🔒 Seguridad de memoria: limitar a los últimos 100 haikus como máximo
    const safeLimit = 100
    const safeData = data.slice(0, safeLimit)

    const urls = safeData.map((item) => {
      return `
        <url>
          <loc>${baseUrl}/haiku/${item.date}</loc>
        </url>
      `
    })

    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls.join('\n')}
      </urlset>
    `.trim()

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
