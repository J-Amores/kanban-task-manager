"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Plus, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

// Mock data for boards
const boards = [
  { id: "1", name: "Platform Launch" },
  { id: "2", name: "Marketing Plan" },
  { id: "3", name: "Roadmap" },
  { id: "4", name: "Example Board" },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [activeBoard, setActiveBoard] = useState("1")

  return (
    <div
      className={cn(
        "h-screen border-r bg-background transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-0 -ml-6 md:w-16 md:ml-0",
      )}
    >
      <div className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-6 bg-primary rounded"></div>
            <div className="w-2 h-6 bg-primary rounded"></div>
            <div className="w-2 h-6 bg-primary rounded"></div>
          </div>
          {isOpen && <span className="text-xl font-bold tracking-wide">kanban</span>}
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <div className="px-4 mb-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {isOpen ? "ALL BOARDS" : ""}
            {!isOpen ? "" : ` (${boards.length})`}
          </h2>
        </div>
        <nav className="space-y-1 px-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className={cn("sidebar-board-item", activeBoard === board.id && "active")}
              onClick={() => setActiveBoard(board.id)}
            >
              <LayoutDashboard size={18} />
              {isOpen && <span>{board.name}</span>}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10 mt-2"
          >
            <Plus size={18} />
            {isOpen && <span className="ml-2">Create New Board</span>}
          </Button>
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <ThemeToggle isCompact={!isOpen} />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={onToggle}
        >
          {isOpen ? (
            <>
              <EyeOff size={16} />
              <span>Hide Sidebar</span>
            </>
          ) : (
            <Eye size={16} />
          )}
        </Button>
      </div>
    </div>
  )
}
