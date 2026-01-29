export const dynamic = "force-static";

export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://starwoodinteriors.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/_next/', '/static/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
