import { createClient } from '@/lib/supabase/server'
import { SERVICES_DATA } from '@/lib/services-data'

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://starwoodinteriors.com'
    const supabase = await createClient()

    // Fetch Blogs
    const { data: blogs } = await supabase
        .from('blogs')
        .select('slug, updated_at')
        .eq('status', 'published')
        .or('archived.is.null,archived.eq.false')

    // Fetch Projects
    const { data: projects } = await supabase
        .from('projects')
        .select('slug, updated_at')
        .eq('status', 'published')

    // Blog URLs
    const blogUrls =
        blogs?.map((blog) => ({
            url: `${baseUrl}/blogs/${blog.slug}`,
            lastModified: new Date(blog.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })) || []

    // Project URLs
    const projectUrls =
        projects?.map((project) => ({
            url: `${baseUrl}/projects/${project.slug}`,
            lastModified: new Date(project.updated_at),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })) || []

    // Service URLs (from static data)
    const serviceUrls = SERVICES_DATA.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Static Routes
    const staticRoutes = [
        '',
        '/about-us',
        '/contact',
        '/services',
        '/blogs',
        '/projects',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...staticRoutes, ...serviceUrls, ...blogUrls, ...projectUrls]
}
