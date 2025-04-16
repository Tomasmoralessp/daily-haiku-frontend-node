export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = 'https://dailyhaiku.vercel.app'

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/haiku/history`, {
      next: { revalidate: 3600 },
    })

    const data: { date: string }[] = await res.ok ? await res.json() : []

    const urls = data.map((item) => {
      return `
        <url>
          <loc>${baseUrl}/haiku/${item.date}</loc>
        </url>
      `
    })

    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl}/</loc>
        </url>
        <url>
          <loc>${baseUrl}/history</loc>
        </url>
        ${urls.join('\n')}
      </urlset>
    `.trim()

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (err) {
    console.error('Error generating sitemap:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
