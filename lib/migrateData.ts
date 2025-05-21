import fs from 'fs';
import path from 'path';
import { prisma } from './db';

const migrateData = async () => {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'data/data.json'),
        'utf-8'
      )
    );

    // Migrate boards and their contents
    for (const [boardIndex, board] of jsonData.boards.entries()) {
      // Create board
      const createdBoard = await prisma.board.create({
        data: {
          name: board.name,
          description: '', // Default empty description
          is_active: true,
        }
      });

      // Create columns for the board
      for (const [columnIndex, column] of board.columns.entries()) {
        const createdColumn = await prisma.column.create({
          data: {
            board_id: createdBoard.id,
            name: column.name,
            position: columnIndex, // Use array index as position
            tasks: {
              create: column.tasks.map((task: any, taskIndex: number) => ({
                title: task.title,
                description: task.description || '',
                position: taskIndex, // Use array index as position
                subtasks: {
                  create: task.subtasks.map((subtask: any) => ({
                    title: subtask.title,
                    is_completed: subtask.isCompleted
                  }))
                }
              }))
            }
          }
        });
      }

      console.log(`✅ Migrated board: ${board.name}`);
    }

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
};

// Run migration
migrateData()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
