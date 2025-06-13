import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Read data.json
  const dataPath = path.join(process.cwd(), 'data', 'data.json')
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

  // Clear existing data
  await prisma.customField.deleteMany()
  await prisma.subtask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.column.deleteMany()
  await prisma.board.deleteMany()
  await prisma.rule.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Seed boards and their columns/tasks
  for (const boardData of jsonData.boards) {
    console.log(`📋 Creating board: ${boardData.name}`)
    
    // Create board
    const board = await prisma.board.create({
      data: {
        id: boardData.id,
        name: boardData.name,
      },
    })

    // Create columns for each board
    for (let columnIndex = 0; columnIndex < boardData.columns.length; columnIndex++) {
      const columnData = boardData.columns[columnIndex]
      
      console.log(`📑 Creating column: ${columnData.name}`)
      
      const column = await prisma.column.create({
        data: {
          id: `column-${boardData.id}-${columnIndex}`,
          name: columnData.name,
          boardId: board.id,
          order: columnIndex,
          color: getColumnColor(columnData.name),
        },
      })

      // Create tasks for each column
      for (let taskIndex = 0; taskIndex < columnData.tasks.length; taskIndex++) {
        const taskData = columnData.tasks[taskIndex]
        
        console.log(`📝 Creating task: ${taskData.title}`)
        
        const task = await prisma.task.create({
          data: {
            id: taskData.id,
            title: taskData.title,
            description: taskData.description || null,
            status: taskData.status || columnData.name,
            columnId: column.id,
            order: taskIndex,
            dueDate: null, // data.json doesn't have due dates, but we'll keep schema ready
          },
        })

        // Create subtasks
        if (taskData.subtasks && taskData.subtasks.length > 0) {
          for (let subtaskIndex = 0; subtaskIndex < taskData.subtasks.length; subtaskIndex++) {
            const subtaskData = taskData.subtasks[subtaskIndex]
            
            await prisma.subtask.create({
              data: {
                title: subtaskData.title,
                isCompleted: subtaskData.isCompleted,
                taskId: task.id,
                order: subtaskIndex,
              },
            })
          }
        }

        // Note: data.json doesn't have custom fields structure that matches our schema
        // We'll add some sample custom fields for demonstration
        if (task.id === '0') {
          await prisma.customField.create({
            data: {
              name: 'Priority',
              value: 'High',
              taskId: task.id,
            },
          })
        }
      }
    }
  }

  // Create some sample automation rules
  console.log('🤖 Creating automation rules...')
  
  // Find a "Blocked" column to use as target
  const blockedColumn = await prisma.column.findFirst({
    where: { name: 'Done' },
  })

  if (blockedColumn) {
    await prisma.rule.create({
      data: {
        name: 'Move completed tasks when all subtasks done',
        conditionType: 'subtasks-completed',
        conditionOperator: 'all-completed',
        actionType: 'move-to-column',
        targetColumnId: blockedColumn.id,
        enabled: true,
      },
    })
  }

  console.log('✅ Database seeded successfully!')
}

function getColumnColor(columnName: string): string {
  const colorMap: { [key: string]: string } = {
    'Todo': 'bg-blue-50 dark:bg-blue-900/30',
    'Doing': 'bg-yellow-50 dark:bg-yellow-900/30',
    'Done': 'bg-green-50 dark:bg-green-900/30',
    'Now': 'bg-purple-50 dark:bg-purple-900/30',
    'Next': 'bg-indigo-50 dark:bg-indigo-900/30',
    'Later': 'bg-gray-50 dark:bg-gray-900/30',
  }
  return colorMap[columnName] || 'bg-gray-50 dark:bg-gray-900/30'
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })