import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const boardId = params.id;

    const columns = await prisma.column.findMany({
      where: {
        board_id: parseInt(boardId),
      },
      orderBy: {
        position: "asc",
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    // Transform the data to include taskCount
    const columnsWithTaskCount = columns.map((column) => ({
      id: column.id,
      name: column.name,
      board_id: column.board_id,
      position: column.position,
      taskCount: column._count.tasks,
      created_at: column.created_at,
      updated_at: column.updated_at,
    }));

    return NextResponse.json(columnsWithTaskCount);
  } catch (error) {
    console.error("[COLUMNS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
