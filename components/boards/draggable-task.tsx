import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "../tasks/task-card";
import { Task } from "@/hooks/queries/use-tasks";
import { motion } from "framer-motion";

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
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        bounce: 0.3,
        duration: 0.3
      }}
    >
      <TaskCard task={task} onClick={onClick} />
    </motion.div>
  );
}
