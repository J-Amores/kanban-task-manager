import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { sourceColumnId, destColumnId, newOrder } = await request.json()
    const { taskId } = await params
    await database.moveTask(taskId, sourceColumnId, destColumnId, newOrder)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error moving task:', error)
    return NextResponse.json(
      { error: 'Failed to move task' },
      { status: 500 }
    )
  }
}