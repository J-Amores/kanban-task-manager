'use client';

import { BoardView } from '@/components/board-view';
import { useParams } from 'next/navigation';
import { useBoards } from '@/hooks/queries/use-boards';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function BoardPage() {
  const params = useParams();
  const { data: boards, isLoading, error } = useBoards();
  const board = boards?.find((b) => b.id.toString() === params.id);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || 'Failed to load board'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!board) {
    return (
      <Alert variant="destructive" className="m-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Board Not Found</AlertTitle>
        <AlertDescription>
          The requested board could not be found.
        </AlertDescription>
      </Alert>
    );
  }

  return <BoardView boardId={board.id.toString()} />;
}
