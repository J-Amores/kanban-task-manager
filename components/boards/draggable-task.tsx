import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "../task-card";
import { Task } from "@/hooks/queries/use-tasks";

interface DraggableTaskProps {
  task: Task;
  onClick: () => void;
}

export function DraggableTask({ task, onClick }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition: "transform 0.2s ease-in-out",
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}
