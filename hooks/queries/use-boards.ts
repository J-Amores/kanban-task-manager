'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { handleError } from '@/lib/utils/error-handler';

interface Board {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateBoardData {
  name: string;
}

interface UpdateBoardData {
  id: string;
  name: string;
}

// API functions
async function getBoards(): Promise<Board[]> {
  const response = await fetch('/api/boards');
  if (!response.ok) {
    throw new Error('Failed to fetch boards');
  }
  return response.json();
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
  
  return response.json();
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

  return response.json();
}

async function deleteBoard(id: string): Promise<void> {
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
