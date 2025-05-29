import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DropZoneProps {
  id: string;
  children: React.ReactNode;
}

export function DropZone({ id, children }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      className={cn(
        "min-h-[100px] rounded-lg relative",
        isOver && "bg-muted/50"
      )}
      animate={{
        backgroundColor: isOver ? "rgba(var(--muted) / 0.5)" : "transparent",
      }}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.2
      }}
    >
      {isOver && (
        <motion.div
          className="absolute inset-0 border-2 border-dashed border-primary rounded-lg pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            bounce: 0.3,
            duration: 0.3
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
