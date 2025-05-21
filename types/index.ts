// Base types for the Kanban Task Manager

export interface Board {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
}

export interface Column {
  id: number;
  title: string;
  boardId: number;
  order: number;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  columnId: number;
  order: number;
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: number;
  title: string;
  isCompleted: boolean;
  taskId: number;
  order: number;
}

// Theme types
export type Theme = 'light' | 'dark';

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Form types
export interface CreateBoardInput {
  title: string;
  columns: { title: string }[];
}

export interface UpdateBoardInput {
  title?: string;
  columns?: { id?: number; title: string }[];
}

export interface CreateTaskInput {
  title: string;
  description: string;
  columnId: number;
  subtasks: { title: string }[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  columnId?: number;
  subtasks?: { id?: number; title: string; isCompleted?: boolean }[];
}
