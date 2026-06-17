import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { members, workspaces } from '@/db/schema'
import { eq } from 'drizzle-orm'

const DEV_USER_ID = 'siva-1781686963884'

export default async function AppPage() {
  const session = await auth()
  const isDev = process.env.NODE_ENV === 'development'
  const userId = session?.user?.id ?? (isDev ? DEV_USER_ID : null)
  if (!userId) redirect('/login')

  const row = await db
    .select({ slug: workspaces.slug })
    .from(members)
    .innerJoin(workspaces, eq(workspaces.id, members.workspaceId))
    .where(eq(members.userId, userId))
    .limit(1)

  if (row[0]?.slug) redirect(`/${row[0].slug}`)
  redirect('/onboarding')
}
