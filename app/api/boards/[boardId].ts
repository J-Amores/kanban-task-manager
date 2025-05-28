import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface PatchParams {
  params: {
    boardId: string;
  };
}

export async function PATCH(request: Request, { params }: PatchParams) {
  try {
    const { boardId } = params;
    const body = await request.json();
    const { name, description, is_active } = body;

    if (!boardId) {
      return new NextResponse('Board ID is required', { status: 400 });
    }

    const numericBoardId = parseInt(boardId, 10);
    if (isNaN(numericBoardId)) {
      return new NextResponse('Invalid Board ID format', { status: 400 });
    }

    const boardToUpdate = await prisma.board.findUnique({
      where: { id: numericBoardId },
    });

    if (!boardToUpdate) {
      return new NextResponse('Board not found', { status: 404 });
    }

    const updatedBoard = await prisma.board.update({
      where: {
        id: numericBoardId,
      },
      data: {
        name: name !== undefined ? name : boardToUpdate.name,
        description: description !== undefined ? description : boardToUpdate.description,
        is_active: is_active !== undefined ? is_active : boardToUpdate.is_active,
      },
    });

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error('[BOARD_PATCH]', error);
    // Prisma's P2025 (Record to update not found) is handled by the explicit check above
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
