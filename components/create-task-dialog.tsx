"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { useCreateTask } from "@/hooks/queries/use-tasks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateTaskDialogProps {
  columnId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({
  columnId,
  open,
  onOpenChange,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subtasks, setSubtasks] = useState<{ id: string; title: string }[]>([])
  const createTask = useCreateTask()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTask.mutate(
      {
        title,
        description,
        columnId,
        position: 0,
        subtasks: subtasks.map((st) => ({
          title: st.title,
          completed: false,
        })),
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setTitle("")
          setDescription("")
          setSubtasks([])
        },
      }
    )
  }

  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      { id: Math.random().toString(), title: "" },
    ])
  }

  const updateSubtask = (id: string, title: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, title } : st))
    )
  }

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
                placeholder="e.g., Take coffee break"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
                placeholder="e.g., It's always good to take a break. This 15 minute break will recharge the batteries a little."
              />
            </div>

            <div>
              <label className="text-sm font-medium leading-none">
                Subtasks
              </label>
              <div className="mt-2 space-y-2">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex gap-2">
                    <Input
                      value={subtask.title}
                      onChange={(e) =>
                        updateSubtask(subtask.id, e.target.value)
                      }
                      placeholder="e.g., Make coffee"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubtask(subtask.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addSubtask}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Subtask
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || createTask.isPending}>
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
