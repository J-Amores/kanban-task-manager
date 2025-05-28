import React from 'react';
import { useBoards, Board } from '@/hooks/use-boards';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming Shadcn Skeleton is available
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming Shadcn Alert
import { Terminal } from 'lucide-react'; // For error icon

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
      {boards.map((board: Board) => (
        <li key={board.id} className="p-2 hover:bg-accent rounded-md cursor-pointer">
          {board.name}
        </li>
      ))}
    </ul>
  );
};
