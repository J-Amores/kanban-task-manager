"use client"

import { MoreVertical, Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"
import { useState } from "react"

interface HeaderProps {
  sidebarOpen: boolean
  onSidebarToggle: () => void
  boardName?: string
}

export function Header({ sidebarOpen, onSidebarToggle, boardName = "Platform Launch" }: HeaderProps) {
  const [addTaskOpen, setAddTaskOpen] = useState(false)

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center">
        {/* Hamburger menu button for small screens */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onSidebarToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-xl font-bold">{boardName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={() => setAddTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Add New Task</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Board</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete Board</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddTaskDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />
    </header>
  )
}
