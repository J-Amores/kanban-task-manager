# Kanban Task Manager

A modern task management application built with Next.js, Prisma, and SQLite. Organize your projects using a flexible kanban board interface with features like drag-and-drop, customizable columns, and subtask management.

## Features

- 📋 Multiple kanban boards for different projects
- 🔄 Drag-and-drop task management
- ✅ Subtask tracking and completion
- 📱 Responsive design for desktop and mobile
- 🌓 Light/Dark theme support

## Tech Stack

- **Framework:** Next.js 14
- **Database:** SQLite with Prisma ORM
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form with Zod validation

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd kanban-task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kanban-task-manager/
├── app/             # Next.js app directory
├── components/      # React components
├── lib/            # Utility functions and database client
├── prisma/         # Database schema and migrations
├── public/         # Static assets
└── types/          # TypeScript type definitions
```

## Database Schema

The application uses a SQLite database with the following structure:
- Boards (id, name, description, is_active)
- Columns (id, board_id, name, position)
- Tasks (id, column_id, title, description, position)
- Subtasks (id, task_id, title, is_completed)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client

## License

This project is licensed under the MIT License - see the LICENSE file for details.
