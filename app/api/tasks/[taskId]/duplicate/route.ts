import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { targetColumnId } = await request.json()
    const { taskId } = await params
    const task = await database.duplicateTask(taskId, targetColumnId)
    return NextResponse.json(task)
  } catch (error) {
    console.error('Error duplicating task:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate task' },
      { status: 500 }
    )
  }
}