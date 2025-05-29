import { Button } from "@/components/ui/button"

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="flex space-x-1 mb-4">
        <div className="w-4 h-12 bg-primary rounded"></div>
        <div className="w-4 h-12 bg-primary rounded"></div>
        <div className="w-4 h-12 bg-primary rounded"></div>
      </div>
      <h1 className="text-4xl font-bold mb-2">kanban</h1>
      <div className="max-w-md">
        <h2 className="text-2xl font-semibold mb-2">
          Welcome to <span className="text-primary">Kanban</span>:
        </h2>
        <p className="text-xl mb-6">
          <span className="text-primary">Task Management App</span> created to make your work organized.
        </p>
        <Button size="lg" className="px-8">
          Create New Board
        </Button>
      </div>
    </div>
  )
}
