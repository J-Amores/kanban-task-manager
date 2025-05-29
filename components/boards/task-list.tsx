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
import { TaskCard } from "../tasks/task-card";
import { motion, AnimatePresence } from "framer-motion";

interface TaskListProps {
  columnId: string;
  onTaskClick?: (task: Task) => void;
}

export function TaskList({ columnId, onTaskClick = () => {} }: TaskListProps) {
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
        const targetTasks = tasks.filter((t) => t.columnId === over.id);
        const sortedTasks = targetTasks.sort((a, b) => a.position - b.position);
        
        // Find the closest tasks to determine the new position
        const overTaskIndex = sortedTasks.findIndex((t) => t.id === over.id);
        const prevTask = overTaskIndex > 0 ? sortedTasks[overTaskIndex - 1] : null;
        const nextTask = overTaskIndex !== -1 ? sortedTasks[overTaskIndex] : null;
        
        // Calculate new position
        let newPosition: number;
        if (!prevTask && !nextTask) {
          // Empty column
          newPosition = 0;
        } else if (!prevTask) {
          // Insert at start
          newPosition = nextTask?.position ?? 0 - 1000;
        } else if (!nextTask) {
          // Insert at end
          newPosition = prevTask.position + 1000;
        } else {
          // Insert between tasks
          newPosition = prevTask.position + (nextTask.position - prevTask.position) / 2;
        }

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
        <motion.div
          className="space-y-2 p-2"
          layout
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.6
          }}
        >
          <AnimatePresence mode="popLayout">
            {tasks
              .sort((a, b) => a.position - b.position)
              .map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.5
                  }}
                >
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </DropZone>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
