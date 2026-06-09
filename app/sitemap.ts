import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://taskflow.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
  ]
}
