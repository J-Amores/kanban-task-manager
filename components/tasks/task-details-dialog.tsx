"use client"

import { useState } from "react"
import { MoreVertical, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Task, useUpdateTask, useDeleteTask } from "@/hooks/queries/use-tasks"

interface TaskDetailsDialogProps {
  task?: Task
  columnId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsDialog({ task, columnId, open, onOpenChange }: TaskDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [subtasks, setSubtasks] = useState(task?.subtasks ?? [])
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (task) {
      // Update existing task
      updateTask.mutate({
        id: task.id,
        title,
        description,
        subtasks: subtasks.map(st => ({
          id: st.id,
          title: st.title,
          completed: st.completed
        }))
      }, {
        onSuccess: () => {
          setIsEditing(false)
        }
      })
    } else {
      // Create new task logic will be added here
    }
  }

  const handleDelete = () => {
    if (task) {
      deleteTask.mutate(task.id, {
        onSuccess: () => onOpenChange(false)
      })
    }
  }

  const toggleSubtask = (id: string) => {
    if (task) {
      const updatedSubtasks = subtasks.map(st =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
      setSubtasks(updatedSubtasks)
      updateTask.mutate({
        id: task.id,
        subtasks: updatedSubtasks
      })
    }
  }

  const completedSubtasks = subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = subtasks.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="w-full">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  className="mb-4"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description"
                  className="mb-4"
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!title.trim()}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <>
                <div className="flex-1">
                  <DialogTitle className="text-xl mb-2">{task?.title}</DialogTitle>
                  {task?.description && (
                    <DialogDescription className="text-sm">
                      {task.description}
                    </DialogDescription>
                  )}
                </div>
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
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={handleDelete}
                    >
                      Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </DialogHeader>
        {!isEditing && (
          <div className="mt-6 space-y-4">
            {totalSubtasks > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">
                  Subtasks ({completedSubtasks} of {totalSubtasks})
                </p>
                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={subtask.id}
                        checked={subtask.completed}
                        onCheckedChange={() => toggleSubtask(subtask.id)}
                      />
                      <label
                        htmlFor={subtask.id}
                        className={`text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {subtask.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
