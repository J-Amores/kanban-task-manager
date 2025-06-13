import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET() {
  try {
    const boards = await database.getBoards()
    return NextResponse.json(boards)
  } catch (error) {
    console.error('Error fetching boards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    )
  }
}