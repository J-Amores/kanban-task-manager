# Kanban Task Manager

> Version: 1.0.0  
> Status: Development

A modern task management application built with Next.js, Prisma, and SQLite. Organize your projects using a flexible kanban board interface with features like drag-and-drop, customizable columns, and subtask management.

## Overview

### Features

- 📋 Multiple kanban boards for different projects
- 🔄 Drag-and-drop task management
- ✅ Subtask tracking and completion
- 📱 Responsive design for desktop and mobile
- 🌓 Light/Dark theme support

### Architecture

- **Framework:** Next.js 14 with App Router
- **Database:** SQLite with Prisma ORM
- **UI Layer:** 
  - Radix UI for accessible components
  - Tailwind CSS for styling
  - Shadcn UI component system
- **State Management:** React Hook Form with Zod validation
- **Type Safety:** TypeScript throughout

### Security Features

- Input validation using Zod schemas
- SQL injection protection via Prisma ORM
- XSS prevention through React's built-in protections
- CSRF protection via Next.js defaults

## Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Initial Setup

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
# Generate Prisma client
npm run generate

# Run migrations
npm run migrate
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kanban-task-manager/
├── app/             # Next.js app directory and routes
├── components/      # Reusable React components
│   ├── ui/         # Base UI components
│   └── features/   # Feature-specific components
├── lib/            # Core utilities and services
│   ├── db.ts       # Database client
│   └── utils/      # Helper functions
├── prisma/         # Database schema and migrations
├── public/         # Static assets
└── types/          # TypeScript type definitions
```

## Database Schema

### Core Entities

#### Board
- Primary key: `id` (Int, auto-increment)
- Fields: name, description, is_active
- Timestamps: created_at, updated_at
- Relations: has many Columns

#### Column
- Primary key: `id` (Int, auto-increment)
- Fields: board_id, name, position
- Timestamps: created_at, updated_at
- Relations: belongs to Board, has many Tasks

#### Task
- Primary key: `id` (Int, auto-increment)
- Fields: column_id, title, description, position
- Timestamps: created_at, updated_at
- Relations: belongs to Column, has many Subtasks

#### Subtask
- Primary key: `id` (Int, auto-increment)
- Fields: task_id, title, is_completed
- Timestamps: created_at, updated_at
- Relations: belongs to Task

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client

### Code Quality Standards

- All code must be typed with TypeScript
- Follow Airbnb Style Guide conventions
- Components must have proper JSDoc comments
- Database operations should use Prisma's type-safe queries
- UI components should follow WCAG accessibility guidelines

### Testing Strategy

- Unit tests for utilities and hooks
- Component tests using React Testing Library
- E2E tests using Playwright (planned)
- Database operations testing using Prisma's testing utilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format

This project follows conventional commits. Each commit message should have a structured format:

```
<type>(<scope>): <description>

[optional body]
[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Maintainers

- Current maintainer: [Your Name]
- Status: Active Development
- Contact: [Your Contact Information]
