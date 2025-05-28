'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { handleError } from '@/lib/utils/error-handler';

interface Board {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateBoardData {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

interface UpdateBoardData {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

// API functions
async function getBoards(): Promise<Board[]> {
  const response = await fetch('/api/boards');
  if (!response.ok) {
    throw new Error('Failed to fetch boards');
  }
  const data = await response.json();
  return data as Board[];
}

async function createBoard(data: CreateBoardData): Promise<Board> {
  const response = await fetch('/api/boards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create board');
  }
  
  return await response.json() as Board;
}

async function updateBoard({ id, ...data }: UpdateBoardData): Promise<Board> {
  const response = await fetch(`/api/boards/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update board');
  }

  return await response.json() as Board;
}

async function deleteBoard(id: number): Promise<void> {
  const response = await fetch(`/api/boards/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete board');
  }
}

// Hooks
export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: (newBoard) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({
        title: 'Success',
        description: `Board "${newBoard.name}" has been created`,
      });
    },
    onError: handleError,
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBoard,
    onSuccess: (updatedBoard) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({
        title: 'Success',
        description: `Board "${updatedBoard.name}" has been updated`,
      });
    },
    onError: handleError,
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({
        title: 'Success',
        description: 'Board has been deleted',
      });
    },
    onError: handleError,
  });
}
