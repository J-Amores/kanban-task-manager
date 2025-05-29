import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TaskList } from "./task-list";

interface ColumnProps {
  id: string;
  title: string;
  taskCount: number;
}

export function Column({ id, title, taskCount }: ColumnProps) {
  return (
    <Card className="w-[300px] bg-muted/50">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>{title}</span>
          <span className="text-muted-foreground">{taskCount}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <TaskList columnId={id} />
      </CardContent>
    </Card>
  );
}
