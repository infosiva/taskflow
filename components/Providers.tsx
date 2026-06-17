'use client'
import { SessionProvider } from 'next-auth/react'

const DEV_SESSION = process.env.NODE_ENV === 'development' ? {
  user: { id: 'siva-1781686963884', name: 'Siva', email: 'info.siva@gmail.com' },
  expires: '2099-01-01',
} : undefined

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={DEV_SESSION as any}>
      {children}
    </SessionProvider>
  )
}
