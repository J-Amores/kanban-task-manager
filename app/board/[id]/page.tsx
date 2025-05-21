import { MainLayout } from "@/components/main-layout"
import { BoardView } from "@/components/board-view"

export default function BoardPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <BoardView boardId={params.id} />
    </MainLayout>
  )
}
