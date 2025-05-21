"use client"

import { Card } from "@/components/ui/card"
import { Task } from "@/hooks/queries/use-tasks"

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = task.subtasks.length

  return (
    <Card
      className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={onClick}
    >
      <h3 className="font-medium text-sm">{task.title}</h3>
      {totalSubtasks > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {completedSubtasks} of {totalSubtasks} subtasks
        </p>
      )}
    </Card>
  )
}
