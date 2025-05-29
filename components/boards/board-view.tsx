import { useColumns } from "@/hooks/queries/use-columns";
import { Column } from "./column";

interface BoardViewProps {
  boardId: string;
}

export function BoardView({ boardId }: BoardViewProps) {
  const { data: columns = [], isLoading } = useColumns(boardId);

  if (isLoading) {
    return <div>Loading board...</div>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {columns.map((column) => (
        <Column
          key={column.id}
          id={column.id}
          title={column.name}
          taskCount={column.taskCount}
        />
      ))}
    </div>
  );
}
