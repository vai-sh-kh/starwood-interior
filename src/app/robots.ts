import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://starwoodinteriors.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/(admin)/', '/api/', '/_next/', '/static/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
