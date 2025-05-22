"use client"

import { useState } from "react"
import { MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useColumns, useCreateColumn, useUpdateColumn, useDeleteColumn } from "@/hooks/queries/use-columns"
import { useTasks } from "@/hooks/queries/use-tasks"
import { TaskCard } from "@/components/task-card"
import { TaskDetailsDialog } from "@/components/task-details-dialog"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { Task } from "@/hooks/queries/use-tasks"

interface BoardViewProps {
  boardId: string;
}

export function BoardView({ boardId }: BoardViewProps) {
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [creatingTaskInColumn, setCreatingTaskInColumn] = useState<string | null>(null);
  const { data: columns, isLoading } = useColumns(boardId);
  const createColumn = useCreateColumn();
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();

  const handleCreateColumn = () => {
    createColumn.mutate({
      name: 'New Column',
      boardId,
      position: columns?.length || 0
    });
  };

  if (isLoading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading columns...</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <div className="flex h-full space-x-4 overflow-x-auto pb-4">
        {columns?.map((column) => (
          <div key={column.id} className="kanban-column flex flex-col">
            <div className="mb-4 flex items-center justify-between w-full pr-2">
              {editingColumn === column.id ? (
                <form
                  className="flex-1 mr-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem('name') as HTMLInputElement;
                    updateColumn.mutate(
                      { id: column.id, name: input.value },
                      { onSuccess: () => setEditingColumn(null) }
                    );
                  }}
                >
                  <Input
                    name="name"
                    defaultValue={column.name}
                    className="h-7 py-1"
                    onBlur={() => setEditingColumn(null)}
                    autoFocus
                  />
                </form>
              ) : (
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {column.name} (0)
                </h3>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setEditingColumn(column.id)}
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => deleteColumn.mutate(column.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-2">
              <TaskList
                columnId={column.id}
                onTaskClick={setSelectedTask}
              />
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setCreatingTaskInColumn(column.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        ))}
        <div className="kanban-column flex flex-col items-center justify-center bg-secondary/50 rounded-lg border border-dashed">
          <Button 
            variant="ghost" 
            className="text-lg font-medium"
            onClick={handleCreateColumn}
            disabled={createColumn.isPending}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Column
          </Button>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          columnId={selectedTask.columnId}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}

      {creatingTaskInColumn && (
        <CreateTaskDialog
          columnId={creatingTaskInColumn}
          open={!!creatingTaskInColumn}
          onOpenChange={(open) => !open && setCreatingTaskInColumn(null)}
        />
      )}
    </div>
  )
}

function TaskList({ columnId, onTaskClick }: { columnId: string; onTaskClick: (task: Task) => void }) {
  const { data: tasks, isLoading } = useTasks(columnId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-[72px] rounded-md bg-secondary/50 animate-pulse" />
        <div className="h-[72px] rounded-md bg-secondary/50 animate-pulse" />
      </div>
    );
  }

  if (!tasks?.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
        />
      ))}
    </div>
  );
}
