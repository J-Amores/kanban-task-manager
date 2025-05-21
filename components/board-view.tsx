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

interface BoardViewProps {
  boardId: string;
}

export function BoardView({ boardId }: BoardViewProps) {
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
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
            <div className="flex-1 space-y-3 overflow-y-auto">
              {/* Task list will be implemented when we add task functionality */}
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


    </div>
  )
}
