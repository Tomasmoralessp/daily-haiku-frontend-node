export const dynamic = 'force-static'

export async function GET() {
  const body = `
User-agent: *
Allow: /

Sitemap: https://dailyhaiku.vercel.app/sitemap.xml
  `.trim()

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
