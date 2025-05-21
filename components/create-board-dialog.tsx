"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CreateBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const [columns, setColumns] = useState([
    { id: "1", name: "TODO" },
    { id: "2", name: "DOING" },
    { id: "3", name: "DONE" },
  ])

  const addColumn = () => {
    setColumns([...columns, { id: `${columns.length + 1}`, name: "" }])
  }

  const removeColumn = (id: string) => {
    setColumns(columns.filter((column) => column.id !== id))
  }

  const updateColumn = (id: string, name: string) => {
    setColumns(columns.map((column) => (column.id === id ? { ...column, name } : column)))
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
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Board Name
              </label>
              <Input id="name" placeholder="e.g. Web Design" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea id="description" placeholder="e.g. This board contains all web design tasks." rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Board Columns</label>
              <div className="space-y-2">
                {columns.map((column) => (
                  <div key={column.id} className="flex items-center gap-2">
                    <Input
                      value={column.name}
                      onChange={(e) => updateColumn(column.id, e.target.value)}
                      placeholder="e.g. TODO"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeColumn(column.id)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="secondary" className="w-full" onClick={addColumn}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Column
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
