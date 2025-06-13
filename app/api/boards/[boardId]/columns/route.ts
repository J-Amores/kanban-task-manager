import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { name, color } = await request.json()
    const { boardId } = await params
    const column = await database.createColumn(boardId, name, color)
    return NextResponse.json(column)
  } catch (error) {
    console.error('Error creating column:', error)
    return NextResponse.json(
      { error: 'Failed to create column' },
      { status: 500 }
    )
  }
}