"use client"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    subtasks: {
      id: string
      title: string
      completed: boolean
    }[]
  }
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = task.subtasks.length

  return (
    <div className="task-card" onClick={onClick}>
      <h3 className="font-semibold mb-2 text-sm">{task.title}</h3>
      <p className="text-xs text-muted-foreground">
        {completedSubtasks} of {totalSubtasks} subtasks
      </p>
    </div>
  )
}
