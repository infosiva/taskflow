import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { boards } from '@/db/schema'
import { eq } from 'drizzle-orm'
import BoardView from '@/components/board/BoardView'

interface Props { params: Promise<{ workspace: string; boardId: string }> }

export default async function BoardPage({ params }: Props) {
  const { boardId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const rows = await db
    .select({ id: boards.id, name: boards.name, icon: boards.icon })
    .from(boards)
    .where(eq(boards.id, boardId))
    .limit(1)

  if (!rows[0]) redirect('/app')

  const board = rows[0]
  return <BoardView boardId={boardId} boardName={board.name} boardIcon={board.icon} />
}
