import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const boards = await prisma.board.findMany({
      orderBy: {
        created_at: 'asc', // Corrected from createdAt to created_at
      },
      // Optionally, include related data if needed, e.g., columns or tasks count
      // include: {
      //   _count: { // Example: count related columns
      //     select: { columns: true },
      //   },
      // },
    });
    return NextResponse.json(boards);
  } catch (error) {
    console.error('[BOARDS_GET]', error);
    // It's good practice to avoid sending detailed error messages to the client in production
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, is_active } = body;

    if (!name) {
      return new NextResponse('Board name is required', { status: 400 });
    }

    const newBoard = await prisma.board.create({
      data: {
        name,
        description,
        is_active, // Prisma schema defaults is_active to true if not provided
      },
    });

    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    console.error('[BOARDS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
