"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Board {
  id: string
  name: string
  columns: any[]
}

interface BoardSidebarProps {
  boards: Board[]
  currentBoardId: string | null
  isOpen: boolean
  onToggle: () => void
  onBoardSelect: (boardId: string) => void
  onCreateBoard: (name: string) => void
  onDeleteBoard?: (boardId: string) => void
  onRenameBoard?: (boardId: string, newName: string) => void
}

export default function BoardSidebar({
  boards,
  currentBoardId,
  isOpen,
  onToggle,
  onBoardSelect,
  onCreateBoard,
  onDeleteBoard,
  onRenameBoard,
}: BoardSidebarProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newBoardName, setNewBoardName] = useState("")
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName.trim())
      setNewBoardName("")
      setIsCreating(false)
    }
  }

  const handleStartEdit = (board: Board) => {
    setEditingBoardId(board.id)
    setEditingName(board.name)
  }

  const handleSaveEdit = () => {
    if (editingBoardId && editingName.trim() && onRenameBoard) {
      onRenameBoard(editingBoardId, editingName.trim())
      setEditingBoardId(null)
      setEditingName("")
    }
  }

  const handleCancelEdit = () => {
    setEditingBoardId(null)
    setEditingName("")
  }

  const handleDeleteBoard = (boardId: string) => {
    if (onDeleteBoard) {
      onDeleteBoard(boardId)
    }
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Boards
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Board List */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {boards.map((board) => (
                <div key={board.id} className="group relative">
                  {editingBoardId === board.id ? (
                    <div className="flex items-center space-x-1 p-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit()
                          if (e.key === "Escape") handleCancelEdit()
                        }}
                        className="flex-1 h-8 text-sm"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="h-8 px-2 text-xs"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <button
                        onClick={() => onBoardSelect(board.id)}
                        className={cn(
                          "flex-1 text-left p-2 rounded-md text-sm transition-colors",
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          currentBoardId === board.id
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{board.name}</span>
                          <span className="text-xs text-gray-400 ml-2">
                            {board.columns.length} cols
                          </span>
                        </div>
                      </button>

                      {/* Board Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 mr-1",
                              "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleStartEdit(board)}>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteBoard(board.id)}
                            className="text-red-600 dark:text-red-400"
                            disabled={boards.length <= 1}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Create Board Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {isCreating ? (
              <div className="space-y-2">
                <Label htmlFor="new-board-name" className="text-sm">
                  Board Name
                </Label>
                <Input
                  id="new-board-name"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateBoard()
                    if (e.key === "Escape") {
                      setIsCreating(false)
                      setNewBoardName("")
                    }
                  }}
                  placeholder="Enter board name"
                  className="h-9"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleCreateBoard} className="flex-1">
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setNewBoardName("")
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsCreating(true)}
                className="w-full justify-start"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Board
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="fixed left-4 top-4 z-50 bg-white dark:bg-gray-800 shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}