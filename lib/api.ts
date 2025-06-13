import type { Task, Column as ColumnType, Rule } from '@/types/kanban'

class ApiService {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Board operations
  async getBoards() {
    return this.request<Array<{ id: string; name: string; columns: ColumnType[] }>>('/api/boards')
  }

  async getBoardById(boardId: string) {
    return this.request<{ id: string; name: string; columns: ColumnType[] }>(`/api/boards?id=${boardId}`)
  }

  async createBoard(name: string) {
    return this.request<{ id: string; name: string; columns: ColumnType[] }>('/api/boards', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  }

  async updateBoard(boardId: string, updates: { name?: string }) {
    return this.request<{ id: string; name: string; columns: ColumnType[] }>(`/api/boards/${boardId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteBoard(boardId: string) {
    return this.request<{ success: boolean }>(`/api/boards/${boardId}`, {
      method: 'DELETE',
    })
  }

  // Column operations
  async createColumn(boardId: string, name: string, color?: string) {
    return this.request<ColumnType>(`/api/boards/${boardId}/columns`, {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    })
  }

  async updateColumn(boardId: string, columnId: string, updates: Partial<ColumnType>) {
    return this.request<ColumnType>(`/api/boards/${boardId}/columns/${columnId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteColumn(boardId: string, columnId: string) {
    return this.request<{ success: boolean }>(`/api/boards/${boardId}/columns/${columnId}`, {
      method: 'DELETE',
    })
  }

  // Task operations
  async createTask(columnId: string, taskData: Omit<Task, 'id' | 'createdAt'>) {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ columnId, ...taskData }),
    })
  }

  async updateTask(taskId: string, updates: Partial<Task>) {
    return this.request<Task>(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteTask(taskId: string) {
    return this.request<{ success: boolean }>(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
  }

  async moveTask(taskId: string, sourceColumnId: string, destColumnId: string, newOrder: number) {
    return this.request<{ success: boolean }>(`/api/tasks/${taskId}/move`, {
      method: 'POST',
      body: JSON.stringify({ sourceColumnId, destColumnId, newOrder }),
    })
  }

  async duplicateTask(taskId: string, targetColumnId?: string) {
    return this.request<Task>(`/api/tasks/${taskId}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ targetColumnId }),
    })
  }

  // Rule operations
  async getRules() {
    return this.request<Rule[]>('/api/rules')
  }

  async createRule(rule: Omit<Rule, 'id'>) {
    return this.request<Rule>('/api/rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    })
  }

  async updateRule(ruleId: string, updates: Partial<Rule>) {
    return this.request<Rule>(`/api/rules/${ruleId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteRule(ruleId: string) {
    return this.request<{ success: boolean }>(`/api/rules/${ruleId}`, {
      method: 'DELETE',
    })
  }
}

export const api = new ApiService()