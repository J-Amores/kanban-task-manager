"use client"

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateBoard, type Board } from "@/hooks/queries/use-boards"; // Import Board type

interface EditBoardDialogProps {
  board: Board | null; // Board to edit, null if not editing
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const boardFormSchema = z.object({
  name: z.string().min(1, { message: "Board name is required." }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type BoardFormData = z.infer<typeof boardFormSchema>;

export function EditBoardDialog({ board, open, onOpenChange }: EditBoardDialogProps) {
  const updateBoardMutation = useUpdateBoard();

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      name: board?.name || "",
      description: board?.description || "",
      is_active: board?.is_active === undefined ? true : board.is_active,
    },
  });

  useEffect(() => {
    if (board) {
      form.reset({
        name: board.name,
        description: board.description || "",
        is_active: board.is_active,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [board, form, open]); // Reset form when board changes or dialog opens/closes

  const onSubmit = (data: BoardFormData) => {
    if (!board) return; // Should not happen if dialog is open with a board

    updateBoardMutation.mutate(
      { boardId: board.id, ...data }, 
      {
        onSuccess: () => {
          // form.reset(); // Optionally reset, or keep values if user wants to edit again
          onOpenChange(false); // Close dialog on success
        },
        // onError is handled by the hook's default handleError
      }
    );
  };

  if (!board) return null; // Don't render if no board is provided (or handle appropriately)

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // if (!isOpen) { form.reset(); } // Reset form if dialog is closed manually - handled by useEffect
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Board: {board.name}</DialogTitle>
          <DialogDescription>
            Update the details for your board. 
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Board Name</Label>
            <Input 
              id="edit-name" 
              placeholder="e.g. Web Design" 
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea 
              id="edit-description" 
              placeholder="e.g. This board contains all web design tasks." 
              rows={3} 
              {...form.register("description")}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="edit-is_active"
              checked={form.watch("is_active")}
              onCheckedChange={(checked) => form.setValue("is_active", checked)}
            />
            <Label htmlFor="edit-is_active">Set as active board</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateBoardMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateBoardMutation.isPending}>
              {updateBoardMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
