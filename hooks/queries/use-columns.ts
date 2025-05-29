'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { handleError } from '@/lib/utils/error-handler';

interface Column {
  id: string;
  name: string;
  boardId: string;
  position: number;
  taskCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateColumnData {
  name: string;
  boardId: string;
  position?: number;
}

interface UpdateColumnData {
  id: string;
  name?: string;
  position?: number;
}

interface ReorderColumnsData {
  boardId: string;
  updates: { id: string; position: number }[];
}

// API functions
async function getColumns(boardId: string): Promise<Column[]> {
  const response = await fetch(`/api/boards/${boardId}/columns`);
  if (!response.ok) {
    throw new Error('Failed to fetch columns');
  }
  return response.json();
}

async function createColumn(data: CreateColumnData): Promise<Column> {
  const response = await fetch(`/api/boards/${data.boardId}/columns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create column');
  }
  
  return response.json();
}

async function updateColumn({ id, ...data }: UpdateColumnData): Promise<Column> {
  const response = await fetch(`/api/columns/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update column');
  }

  return response.json();
}

async function deleteColumn(id: string): Promise<void> {
  const response = await fetch(`/api/columns/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete column');
  }
}

async function reorderColumns(data: ReorderColumnsData): Promise<Column[]> {
  const response = await fetch(`/api/boards/${data.boardId}/columns/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data.updates),
  });

  if (!response.ok) {
    throw new Error('Failed to reorder columns');
  }

  return response.json();
}

// Hooks
export function useColumns(boardId: string) {
  return useQuery({
    queryKey: ['columns', boardId],
    queryFn: () => getColumns(boardId),
    enabled: !!boardId, // Only run query if boardId is provided
  });
}

export function useCreateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createColumn,
    onSuccess: (newColumn) => {
      queryClient.invalidateQueries({ 
        queryKey: ['columns', newColumn.boardId] 
      });
      toast({
        title: 'Success',
        description: `Column "${newColumn.name}" has been created`,
      });
    },
    onError: handleError,
  });
}

export function useUpdateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateColumn,
    onSuccess: (updatedColumn) => {
      queryClient.invalidateQueries({ 
        queryKey: ['columns', updatedColumn.boardId] 
      });
      toast({
        title: 'Success',
        description: `Column "${updatedColumn.name}" has been updated`,
      });
    },
    onError: handleError,
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteColumn,
    onSuccess: (_, variables) => {
      // We'll need to invalidate all column queries since we don't know the boardId here
      queryClient.invalidateQueries({ 
        queryKey: ['columns'] 
      });
      toast({
        title: 'Success',
        description: 'Column has been deleted',
      });
    },
    onError: handleError,
  });
}

export function useReorderColumns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderColumns,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['columns', variables.boardId] 
      });
      toast({
        title: 'Success',
        description: 'Columns have been reordered',
      });
    },
    onError: handleError,
  });
}
