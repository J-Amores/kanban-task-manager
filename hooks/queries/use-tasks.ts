import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/utils/error-handler";

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  position: number;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

interface CreateTaskData {
  title: string;
  description?: string;
  columnId: string;
  position: number;
  subtasks?: { title: string; completed?: boolean; }[];
}

interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  columnId?: string;
  position?: number;
  subtasks?: { id?: string; title: string; completed?: boolean; }[];
}

// Fetch tasks for a specific column
async function getTasks(columnId: string): Promise<Task[]> {
  const response = await fetch(`/api/columns/${columnId}/tasks`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

// Create a new task
async function createTask(data: CreateTaskData): Promise<Task> {
  const response = await fetch(`/api/columns/${data.columnId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
}

// Update a task
async function updateTask(data: UpdateTaskData): Promise<Task> {
  const response = await fetch(`/api/tasks/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
}

// Delete a task
async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

// Move a task to a different column or position
async function moveTask(taskId: string, columnId: string, position: number): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columnId, position }),
  });
  if (!response.ok) {
    throw new Error("Failed to move task");
  }
  return response.json();
}

// Hook to fetch tasks for a column
export function useTasks(columnId: string) {
  return useQuery({
    queryKey: ["tasks", columnId],
    queryFn: () => getTasks(columnId),
  });
}

// Hook to create a new task
export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", newTask.columnId] });
      toast({ description: "Task created successfully" });
    },
    onError: handleError,
  });
}

// Hook to update a task
export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", updatedTask.columnId] });
      toast({ description: "Task updated successfully" });
    },
    onError: handleError,
  });
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      // We'll need to invalidate all task queries since we don't know the columnId
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ description: "Task deleted successfully" });
    },
    onError: handleError,
  });
}

// Hook to move a task
export function useMoveTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, columnId, position }: { taskId: string; columnId: string; position: number }) =>
      moveTask(taskId, columnId, position),
    onSuccess: (movedTask, { columnId: newColumnId }) => {
      // Invalidate both old and new column's tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ description: "Task moved successfully" });
    },
    onError: handleError,
  });
}
