import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { members, workspaces } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function AppPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const row = await db
    .select({ slug: workspaces.slug })
    .from(members)
    .innerJoin(workspaces, eq(workspaces.id, members.workspaceId))
    .where(eq(members.userId, session.user.id))
    .limit(1)

  if (row[0]?.slug) redirect(`/${row[0].slug}`)
  redirect('/onboarding')
}
