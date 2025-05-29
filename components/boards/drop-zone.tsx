import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  id: string;
  children: React.ReactNode;
}

export function DropZone({ id, children }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[100px] rounded-lg transition-colors",
        isOver && "bg-muted/50"
      )}
    >
      {children}
    </div>
  );
}
