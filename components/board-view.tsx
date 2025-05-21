"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { TaskDetailsDialog } from "@/components/task-details-dialog"

// Mock data for columns and tasks
const boardData = {
  columns: [
    {
      id: "1",
      name: "TODO",
      tasks: [
        {
          id: "1",
          title: "Build UI for onboarding flow",
          description: "",
          subtasks: [
            { id: "1", title: "Sign up page", completed: true },
            { id: "2", title: "Sign in page", completed: false },
            { id: "3", title: "Welcome page", completed: false },
          ],
        },
        {
          id: "2",
          title: "Build UI for search",
          description: "",
          subtasks: [{ id: "1", title: "Search page", completed: false }],
        },
        {
          id: "3",
          title: "Build settings UI",
          description: "",
          subtasks: [
            { id: "1", title: "Account page", completed: false },
            { id: "2", title: "Billing page", completed: false },
          ],
        },
        {
          id: "4",
          title: "QA and test all major user journeys",
          description:
            "Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.",
          subtasks: [
            { id: "1", title: "Internal testing", completed: false },
            { id: "2", title: "External testing", completed: false },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "DOING",
      tasks: [
        {
          id: "5",
          title: "Design settings and search pages",
          description: "",
          subtasks: [
            { id: "1", title: "Settings - Account page", completed: true },
            { id: "2", title: "Settings - Billing page", completed: true },
            { id: "3", title: "Search page", completed: false },
          ],
        },
        {
          id: "6",
          title: "Add account management endpoints",
          description: "",
          subtasks: [
            { id: "1", title: "Upgrade plan", completed: true },
            { id: "2", title: "Cancel plan", completed: true },
            { id: "3", title: "Update payment method", completed: false },
          ],
        },
        {
          id: "7",
          title: "Design onboarding flow",
          description: "",
          subtasks: [
            { id: "1", title: "Sign up page", completed: true },
            { id: "2", title: "Sign in page", completed: false },
            { id: "3", title: "Welcome page", completed: false },
          ],
        },
        {
          id: "8",
          title: "Add search endpoints",
          description: "",
          subtasks: [
            { id: "1", title: "Add search endpoint", completed: true },
            { id: "2", title: "Define search filters", completed: false },
          ],
        },
        {
          id: "9",
          title: "Add authentication endpoints",
          description: "",
          subtasks: [
            { id: "1", title: "Define user model", completed: true },
            { id: "2", title: "Add auth endpoints", completed: false },
          ],
        },
        {
          id: "10",
          title: "Research pricing points of various competitors and trial different business models",
          description:
            "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
          subtasks: [
            { id: "1", title: "Research competitor pricing and business models", completed: true },
            { id: "2", title: "Outline our business model", completed: true },
            {
              id: "3",
              title: "Talk to potential customers about our proposed solution and ask for fair price expectancy",
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "DONE",
      tasks: [
        {
          id: "11",
          title: "Conduct 5 wireframe tests",
          description: "Ensure the layout continues to make sense and we have strong buy-in from potential users.",
          subtasks: [{ id: "1", title: "Complete 5 wireframe prototype tests", completed: true }],
        },
        {
          id: "12",
          title: "Create wireframe prototype",
          description: "Create a greyscale clickable wireframe prototype to test our assumptions so far.",
          subtasks: [{ id: "1", title: "Create clickable wireframe prototype in Balsamiq", completed: true }],
        },
        {
          id: "13",
          title: "Review results of usability tests and iterate",
          description: "Keep iterating through the subtasks until we're clear on what we're building.",
          subtasks: [
            { id: "1", title: "Meet to review usability test results", completed: true },
            { id: "2", title: "Make changes to paper prototypes", completed: true },
            { id: "3", title: "Conduct 5 usability tests", completed: true },
          ],
        },
        {
          id: "14",
          title: "Create paper prototypes and conduct 10 usability tests with potential customers",
          description: "",
          subtasks: [
            { id: "1", title: "Create paper prototypes for version one", completed: true },
            { id: "2", title: "Complete 10 usability tests", completed: true },
          ],
        },
        {
          id: "15",
          title: "Market discovery",
          description:
            "We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.",
          subtasks: [{ id: "1", title: "Interview 10 prospective customers", completed: true }],
        },
        {
          id: "16",
          title: "Competitor analysis",
          description: "",
          subtasks: [
            { id: "1", title: "Find direct and indirect competitors", completed: true },
            { id: "2", title: "SWOT analysis for each competitor", completed: true },
          ],
        },
        {
          id: "17",
          title: "Research the market",
          description:
            "We need to get a solid overview of the market to ensure we have up-to-date estimates of market size and demand.",
          subtasks: [
            { id: "1", title: "Write up research analysis", completed: true },
            { id: "2", title: "Calculate TAM", completed: true },
          ],
        },
      ],
    },
  ],
}

interface BoardViewProps {
  boardId: string
}

export function BoardView({ boardId }: BoardViewProps) {
  const [selectedTask, setSelectedTask] = useState<any | null>(null)

  return (
    <div className="h-full p-4">
      <div className="flex h-full space-x-4 overflow-x-auto pb-4">
        {boardData.columns.map((column) => (
          <div key={column.id} className="kanban-column flex flex-col">
            <div className="mb-4 flex items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {column.name} ({column.tasks.length})
              </h3>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
              ))}
            </div>
          </div>
        ))}
        <div className="kanban-column flex flex-col items-center justify-center bg-secondary/50 rounded-lg border border-dashed">
          <Button variant="ghost" className="text-lg font-medium">
            <Plus className="mr-2 h-5 w-5" />
            New Column
          </Button>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </div>
  )
}
