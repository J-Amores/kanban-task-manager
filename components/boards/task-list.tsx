import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { Task, useMoveTask, useTasks } from "@/hooks/queries/use-tasks";
import { DraggableTask } from "./draggable-task";
import { DropZone } from "./drop-zone";
import { TaskCard } from "../task-card";

interface TaskListProps {
  columnId: string;
}

export function TaskList({ columnId }: TaskListProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { data: tasks = [], isLoading } = useTasks(columnId);
  const { mutate: moveTask } = useMoveTask();

  // Configure sensors for both mouse and touch interactions
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // 10px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay for touch devices
        tolerance: 5, // 5px tolerance
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const task = tasks.find((t) => t.id === active.id);
      if (task) {
        // Calculate new position based on target column's tasks
        const targetTasks = tasks.filter((t) => t.columnId === over.id);
        const newPosition = targetTasks.length
          ? Math.max(...targetTasks.map((t) => t.position)) + 1
          : 0;

        moveTask({
          taskId: task.id,
          columnId: over.id as string,
          position: newPosition,
        });
      }
    }
    
    setActiveTask(null);
  };

  if (isLoading) {
    return <div className="p-4">Loading tasks...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DropZone id={columnId}>
        <div className="space-y-2 p-2">
          {tasks
            .sort((a, b) => a.position - b.position)
            .map((task) => (
              <DraggableTask key={task.id} task={task} />
            ))}
        </div>
      </DropZone>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
