import type { MetadataRoute } from 'next'

const baseUrl = 'https://nativly.az'
const locales = ['az', 'en', 'ru']

const pages = [
  '',
  '/about',
  '/pricing',
  '/how-it-works',
  '/become-tutor',
  '/faq',
  '/privacy',
  '/terms',
  '/contact',
  '/login',
  '/register',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      })
    }
  }

  return entries
}
