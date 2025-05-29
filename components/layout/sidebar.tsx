"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'; 
import { LayoutDashboard, Plus, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useBoards } from '@/hooks/queries/use-boards';
import { CreateBoardDialog } from "@/components/create-board-dialog"; 

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { data: boards, isLoading, error } = useBoards();
  const pathname = usePathname(); 
  const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] = useState(false);

  // Determine active board based on pathname
  const activeBoardId = pathname.startsWith('/board/') ? pathname.split('/')[2] : null;

  return (
    <>
      <div
        className={cn(
          "h-screen bg-background flex flex-col transition-all duration-300 ease-in-out z-40", 
          // Mobile (default): fixed, slides in/out
          "fixed top-0 left-0 w-64 border-r", 
          isOpen ? "translate-x-0" : "-translate-x-full", 
          // Medium screens and up (md:): relative, in-flow
          "md:relative md:translate-x-0", 
          isOpen ? "md:w-64" : "md:w-16" 
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
              {!isOpen ? "" : ` (${boards?.length || 0})`}
            </h2>
          </div>
          <nav className="space-y-1 px-2">
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error.message}</div>
            ) : (
              boards?.map((board) => (
                <Link
                  key={board.id}
                  href={`/board/${board.id}`}
                  className={cn(
                    "sidebar-board-item", 
                    "flex items-center p-2 rounded-md hover:bg-accent",
                    activeBoardId === String(board.id) && "bg-accent text-accent-foreground"
                  )}
                >
                  <LayoutDashboard size={18} className={cn(isOpen && "mr-2")} />
                  {isOpen && <span>{board.name}</span>}
                </Link>
              ))
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10 mt-2"
              onClick={() => setIsCreateBoardDialogOpen(true)} 
            >
              <Plus size={18} className={cn(isOpen && "mr-2")} />
              {isOpen && <span className="ml-0">Create New Board</span>} 
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
            className="w-full flex items-center justify-center gap-2 md:flex hidden"
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
      {/* Backdrop for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      <CreateBoardDialog 
        open={isCreateBoardDialogOpen} 
        onOpenChange={setIsCreateBoardDialogOpen} 
      />
    </>
  )
}
