import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://taskflow.app'),
  title: 'TaskFlow — AI-Native Project Tracker for Modern Teams',
  description: 'Monday power, Linear speed, half the price. Custom columns, 4 views, and AI features built-in free. Track tasks, manage boards, ship faster.',
  openGraph: {
    title: 'TaskFlow — AI-Native Project Tracker',
    description: 'Custom column engine + AI assign, subtasks, risk detection — all free tier.',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'TaskFlow',
              url: process.env.NEXT_PUBLIC_APP_URL,
              applicationCategory: 'BusinessApplication',
              description: 'AI-native project tracker with custom column engine',
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
