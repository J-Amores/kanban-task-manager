"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { DeleteTaskDialog } from "@/components/delete-task-dialog"

interface TaskDetailsDialogProps {
  task: {
    id: string
    title: string
    description: string
    subtasks: {
      id: string
      title: string
      completed: boolean
    }[]
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsDialog({ task, open, onOpenChange }: TaskDetailsDialogProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subtasks, setSubtasks] = useState(task.subtasks)
  const [status, setStatus] = useState("2") // Default to "DOING"

  const completedSubtasks = subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = subtasks.length

  const toggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((subtask) => (subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask)),
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-start justify-between">
            <DialogTitle className="pr-8">{task.title}</DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>Edit Task</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogHeader>

          {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}

          <div className="space-y-3">
            <h3 className="text-sm font-medium">
              Subtasks ({completedSubtasks} of {totalSubtasks})
            </h3>
            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-2 rounded-md bg-secondary p-2">
                  <Checkbox
                    id={`subtask-${subtask.id}`}
                    checked={subtask.completed}
                    onCheckedChange={() => toggleSubtask(subtask.id)}
                  />
                  <label
                    htmlFor={`subtask-${subtask.id}`}
                    className={`text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {subtask.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Current Status</h3>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">TODO</SelectItem>
                <SelectItem value="2">DOING</SelectItem>
                <SelectItem value="3">DONE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      <EditTaskDialog task={task} open={editDialogOpen} onOpenChange={setEditDialogOpen} />

      <DeleteTaskDialog taskName={task.title} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
    </>
  )
}
