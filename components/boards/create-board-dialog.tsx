"use client"

import React, { useState } from "react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateBoard } from "@/hooks/queries/use-boards"; 

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const boardFormSchema = z.object({
  name: z.string().min(1, { message: "Board name is required." }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type BoardFormData = z.infer<typeof boardFormSchema>;

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const createBoardMutation = useCreateBoard();

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  const onSubmit = (data: BoardFormData) => {
    createBoardMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false); 
      },
      // onError is handled by the hook's default handleError
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset(); 
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Give your new board a name. You can add a description and set its active status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Board Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Web Design" 
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              placeholder="e.g. This board contains all web design tasks." 
              rows={3} 
              {...form.register("description")}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="is_active"
              checked={form.watch("is_active")}
              onCheckedChange={(checked) => form.setValue("is_active", checked)}
            />
            <Label htmlFor="is_active">Set as active board</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createBoardMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={createBoardMutation.isPending}>
              {createBoardMutation.isPending ? "Creating..." : "Create Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
