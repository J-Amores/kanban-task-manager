import { prisma } from './prisma'
import type { Task, Column as ColumnType, Rule, Subtask, CustomField } from '@/types/kanban'

// Transform Prisma result to frontend type
function transformTask(task: any): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status,
    dueDate: task.dueDate?.toISOString() || null,
    subtasks: task.subtasks?.map((st: any): Subtask => ({
      id: st.id,
      title: st.title,
      completed: st.isCompleted,
    })) || [],
    customFields: task.customFields?.map((cf: any): CustomField => ({
      id: cf.id,
      name: cf.name,
      value: cf.value,
    })) || [],
    createdAt: task.createdAt.toISOString(),
  }
}

function transformColumn(column: any): ColumnType {
  return {
    id: column.id,
    title: column.name,
    color: column.color,
    tasks: column.tasks?.map(transformTask) || [],
  }
}

export const database = {
  // Board operations
  async createBoard(name: string) {
    const board = await prisma.board.create({
      data: {
        id: `board-${Date.now()}`,
        name,
      },
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                subtasks: {
                  orderBy: { order: 'asc' }
                },
                customFields: true,
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    return {
      id: board.id,
      name: board.name,
      columns: board.columns.map(transformColumn)
    }
  },

  async updateBoard(boardId: string, updates: { name?: string }) {
    const board = await prisma.board.update({
      where: { id: boardId },
      data: updates,
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                subtasks: {
                  orderBy: { order: 'asc' }
                },
                customFields: true,
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    return {
      id: board.id,
      name: board.name,
      columns: board.columns.map(transformColumn)
    }
  },

  async deleteBoard(boardId: string) {
    await prisma.board.delete({
      where: { id: boardId }
    })
  },

  async getBoards() {
    const boards = await prisma.board.findMany({
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                subtasks: {
                  orderBy: { order: 'asc' }
                },
                customFields: true,
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    return boards.map(board => ({
      id: board.id,
      name: board.name,
      columns: board.columns.map(transformColumn)
    }))
  },

  async getBoardById(boardId: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                subtasks: {
                  orderBy: { order: 'asc' }
                },
                customFields: true,
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!board) return null

    return {
      id: board.id,
      name: board.name,
      columns: board.columns.map(transformColumn)
    }
  },

  // Column operations
  async createColumn(boardId: string, name: string, color?: string) {
    const maxOrder = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' }
    })

    const column = await prisma.column.create({
      data: {
        name,
        color,
        boardId,
        order: (maxOrder?.order || 0) + 1
      },
      include: {
        tasks: {
          include: {
            subtasks: {
              orderBy: { order: 'asc' }
            },
            customFields: true,
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    return transformColumn(column)
  },

  async updateColumn(columnId: string, updates: { name?: string; color?: string }) {
    const column = await prisma.column.update({
      where: { id: columnId },
      data: updates,
      include: {
        tasks: {
          include: {
            subtasks: {
              orderBy: { order: 'asc' }
            },
            customFields: true,
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    return transformColumn(column)
  },

  async deleteColumn(columnId: string) {
    await prisma.column.delete({
      where: { id: columnId }
    })
  },

  // Task operations
  async createTask(columnId: string, taskData: Omit<Task, 'id' | 'createdAt'>) {
    const maxOrder = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' }
    })

    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        columnId,
        order: (maxOrder?.order || 0) + 1
      },
      include: {
        subtasks: {
          orderBy: { order: 'asc' }
        },
        customFields: true,
      }
    })

    // Create subtasks if provided
    if (taskData.subtasks && taskData.subtasks.length > 0) {
      await Promise.all(
        taskData.subtasks.map((subtask, index) =>
          prisma.subtask.create({
            data: {
              title: subtask.title,
              isCompleted: subtask.completed,
              taskId: task.id,
              order: index
            }
          })
        )
      )
    }

    // Create custom fields if provided
    if (taskData.customFields && taskData.customFields.length > 0) {
      await Promise.all(
        taskData.customFields.map(field =>
          prisma.customField.create({
            data: {
              name: field.name,
              value: field.value,
              taskId: task.id
            }
          })
        )
      )
    }

    // Fetch the complete task with relations
    const completeTask = await prisma.task.findUnique({
      where: { id: task.id },
      include: {
        subtasks: {
          orderBy: { order: 'asc' }
        },
        customFields: true,
      }
    })

    return transformTask(completeTask)
  },

  async updateTask(taskId: string, updates: Partial<Task>) {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: updates.title,
        description: updates.description,
        status: updates.status,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : null,
      },
      include: {
        subtasks: {
          orderBy: { order: 'asc' }
        },
        customFields: true,
      }
    })

    return transformTask(task)
  },

  async moveTask(taskId: string, sourceColumnId: string, destColumnId: string, newOrder: number) {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: destColumnId,
        order: newOrder
      }
    })

    // Update status to match the destination column
    const destColumn = await prisma.column.findUnique({
      where: { id: destColumnId }
    })

    if (destColumn) {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: destColumn.name }
      })
    }
  },

  async deleteTask(taskId: string) {
    await prisma.task.delete({
      where: { id: taskId }
    })
  },

  async duplicateTask(taskId: string, targetColumnId?: string) {
    const originalTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        subtasks: {
          orderBy: { order: 'asc' }
        },
        customFields: true,
      }
    })

    if (!originalTask) throw new Error('Task not found')

    const columnId = targetColumnId || originalTask.columnId
    const maxOrder = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' }
    })

    // Create the duplicated task
    const duplicatedTask = await prisma.task.create({
      data: {
        title: `${originalTask.title} (Copy)`,
        description: originalTask.description,
        status: originalTask.status,
        dueDate: originalTask.dueDate,
        columnId,
        order: (maxOrder?.order || 0) + 1
      }
    })

    // Duplicate subtasks
    if (originalTask.subtasks.length > 0) {
      await Promise.all(
        originalTask.subtasks.map((subtask, index) =>
          prisma.subtask.create({
            data: {
              title: subtask.title,
              isCompleted: subtask.isCompleted,
              taskId: duplicatedTask.id,
              order: index
            }
          })
        )
      )
    }

    // Duplicate custom fields
    if (originalTask.customFields.length > 0) {
      await Promise.all(
        originalTask.customFields.map(field =>
          prisma.customField.create({
            data: {
              name: field.name,
              value: field.value,
              taskId: duplicatedTask.id
            }
          })
        )
      )
    }

    // Return the complete duplicated task
    const completeTask = await prisma.task.findUnique({
      where: { id: duplicatedTask.id },
      include: {
        subtasks: {
          orderBy: { order: 'asc' }
        },
        customFields: true,
      }
    })

    return transformTask(completeTask)
  },

  // Rule operations
  async getRules() {
    const rules = await prisma.rule.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return rules.map((rule): Rule => ({
      id: rule.id,
      name: rule.name,
      enabled: rule.enabled,
      condition: {
        type: rule.conditionType as any,
        field: rule.conditionField || undefined,
        operator: rule.conditionOperator as any,
        value: rule.conditionValue || undefined,
      },
      action: {
        type: rule.actionType as any,
        targetColumnId: rule.targetColumnId,
      },
    }))
  },

  async createRule(rule: Omit<Rule, 'id'>) {
    const createdRule = await prisma.rule.create({
      data: {
        name: rule.name,
        enabled: rule.enabled,
        conditionType: rule.condition.type,
        conditionField: rule.condition.field || null,
        conditionOperator: rule.condition.operator,
        conditionValue: rule.condition.value || null,
        actionType: rule.action.type,
        targetColumnId: rule.action.targetColumnId,
      }
    })

    return {
      id: createdRule.id,
      name: createdRule.name,
      enabled: createdRule.enabled,
      condition: {
        type: createdRule.conditionType as any,
        field: createdRule.conditionField,
        operator: createdRule.conditionOperator as any,
        value: createdRule.conditionValue,
      },
      action: {
        type: createdRule.actionType as any,
        targetColumnId: createdRule.targetColumnId,
      },
    }
  },

  async updateRule(ruleId: string, updates: Partial<Rule>) {
    const rule = await prisma.rule.update({
      where: { id: ruleId },
      data: {
        name: updates.name,
        enabled: updates.enabled,
        conditionType: updates.condition?.type,
        conditionField: updates.condition?.field || null,
        conditionOperator: updates.condition?.operator,
        conditionValue: updates.condition?.value || null,
        actionType: updates.action?.type,
        targetColumnId: updates.action?.targetColumnId,
      }
    })

    return {
      id: rule.id,
      name: rule.name,
      enabled: rule.enabled,
      condition: {
        type: rule.conditionType as any,
        field: rule.conditionField || undefined,
        operator: rule.conditionOperator as any,
        value: rule.conditionValue || undefined,
      },
      action: {
        type: rule.actionType as any,
        targetColumnId: rule.targetColumnId,
      },
    }
  },

  async deleteRule(ruleId: string) {
    await prisma.rule.delete({
      where: { id: ruleId }
    })
  },
}