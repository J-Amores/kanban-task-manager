"use client"

import { useCallback } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteBoard } from "@/hooks/queries/use-boards"
import { useToast } from "@/components/ui/use-toast"

interface DeleteBoardDialogProps {
  /** ID of the board to delete */
  boardId: number
  /** Name of the board to display in confirmation message */
  boardName: string
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
}

/**
 * Dialog component for confirming board deletion
 * Uses ShadcnUI AlertDialog for consistent styling and accessibility
 */
export function DeleteBoardDialog({ boardId, boardName, open, onOpenChange }: DeleteBoardDialogProps) {
  const { toast } = useToast()
  const deleteBoardMutation = useDeleteBoard()

  const handleDelete = useCallback(async () => {
    try {
      await deleteBoardMutation.mutateAsync(boardId)
      toast({
        title: "Board deleted",
        description: `Successfully deleted board "${boardName}"`
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete board. Please try again.",
        variant: "destructive"
      })
    }
  }, [boardId, boardName, deleteBoardMutation, onOpenChange, toast])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Delete this board?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the &quot;{boardName}&quot; board? This action will remove all columns and
            tasks and cannot be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={deleteBoardMutation.isPending}
          >
            {deleteBoardMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
