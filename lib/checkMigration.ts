import { prisma } from './db';

async function checkMigration() {
  try {
    // Check boards
    const boards = await prisma.board.findMany({
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                subtasks: true
              }
            }
          }
        }
      }
    });

    console.log('\n=== Migration Check Results ===\n');
    
    if (boards.length === 0) {
      console.log('❌ No data found - Migration has not been performed');
      return;
    }

    console.log('✅ Found', boards.length, 'boards');
    
    // Print summary for each board
    boards.forEach(board => {
      console.log(`\nBoard: ${board.name} (${board.id})`);
      console.log(`├── ${board.columns.length} Columns`);
      
      let totalTasks = 0;
      let totalSubtasks = 0;
      
      board.columns.forEach(column => {
        totalTasks += column.tasks.length;
        column.tasks.forEach(task => {
          totalSubtasks += task.subtasks.length;
        });
      });
      
      console.log(`├── ${totalTasks} Tasks`);
      console.log(`└── ${totalSubtasks} Subtasks`);
    });

  } catch (error) {
    console.error('Error checking migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run check
checkMigration().catch(console.error);
