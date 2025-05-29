"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const [subtasks, setSubtasks] = useState([
    { id: "1", title: "" },
    { id: "2", title: "" },
  ])
  const [status, setStatus] = useState("1") // Default to "TODO"

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: `${subtasks.length + 1}`, title: "" }])
  }

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id))
  }

  const updateSubtask = (id: string, title: string) => {
    setSubtasks(subtasks.map((subtask) => (subtask.id === id ? { ...subtask, title } : subtask)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input id="title" placeholder="e.g. Take coffee break" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtasks</label>
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Input
                      value={subtask.title}
                      onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                      placeholder="e.g. Make coffee"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSubtask(subtask.id)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="secondary" className="w-full" onClick={addSubtask}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Subtask
              </Button>
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
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
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
