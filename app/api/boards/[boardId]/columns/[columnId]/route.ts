import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ boardId: string; columnId: string }> }
) {
  try {
    const updates = await request.json()
    const { columnId } = await params
    const column = await database.updateColumn(columnId, updates)
    return NextResponse.json(column)
  } catch (error) {
    console.error('Error updating column:', error)
    return NextResponse.json(
      { error: 'Failed to update column' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ boardId: string; columnId: string }> }
) {
  try {
    const { columnId } = await params
    await database.deleteColumn(columnId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting column:', error)
    return NextResponse.json(
      { error: 'Failed to delete column' },
      { status: 500 }
    )
  }
}