import type { Metadata } from 'next'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://taskflow.app'),
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
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
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://taskflow.app',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              description: 'AI-native project tracker with custom column engine. Auto-assign tasks, flag sprint risks, generate summaries — all in the free tier.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free tier: 3 boards, 20 AI calls/month',
              },
              featureList: [
                'AI auto-assign tasks before standup',
                'Sprint risk detection',
                'AI sprint summary in 2 sentences',
                'Custom column engine (8 column types)',
                'Kanban, Table, Timeline, Calendar views',
                'No-login demo board',
                'Import from Jira, Trello, GitHub, Linear',
                'Agent activity feed',
                'Free tier — 20 AI calls/month',
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <FloatingChatWrapper />
        <Toaster />
        <Script defer data-domain="taskflow.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
