'use client';

import React from 'react';
import { useBoards } from '@/hooks/queries/use-boards';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';

export const BoardList: React.FC = () => {
  const { data: boards, isLoading, isError, error } = useBoards();

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Fetching Boards</AlertTitle>
        <AlertDescription>
          {error?.message || 'An unexpected error occurred.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!boards || boards.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No boards found.</p>;
  }

  return (
    <ul className="space-y-1 p-4">
      {boards.map((board) => {
        const params = useParams();
        const router = useRouter();
        const isActive = params.boardId === board.id.toString();
        
        return (
          <li
            key={board.id}
            onClick={() => router.push(`/boards/${board.id}`)}
            className={cn(
              "p-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2",
              isActive && "bg-accent"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{board.name}</span>
          </li>
        );
      })}
    </ul>
  );
};
