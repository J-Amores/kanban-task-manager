import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(request: Request) {
  try {
    const { columnId, ...taskData } = await request.json()
    const task = await database.createTask(columnId, taskData)
    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}