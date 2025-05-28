import { Metadata } from "next"
import { BoardList } from "@/components/board-list"

export const metadata: Metadata = {
  title: "Boards | Kanban Task Manager",
  description: "View and manage your Kanban boards",
}

export default function BoardsPage() {
  return (
    <div className="h-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Boards</h1>
        <p className="text-muted-foreground">
          Manage and organize your tasks with Kanban boards
        </p>
      </div>
      <BoardList />
    </div>
  )
}
