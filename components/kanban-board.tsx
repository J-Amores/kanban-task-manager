"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Plus } from "lucide-react"
import Column from "./column"
import TaskDetailSidebar from "./task-detail-sidebar"
import AutomationRules from "./automation-rules"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Task, Column as ColumnType, Rule } from "@/types/kanban"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import Logo from "./logo"
import BoardSidebar from "./board-sidebar"


interface Board {
  id: string
  name: string
  columns: ColumnType[]
}

export default function KanbanBoard() {
  const { toast } = useToast()
  const [boards, setBoards] = useState<Board[]>([])
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [rules, setRules] = useState<Rule[]>([])
  const [activeTab, setActiveTab] = useState("board")
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Derived state
  const columns = currentBoard?.columns || []
  const currentBoardId = currentBoard?.id || null

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Load boards
        const boardsData = await api.getBoards()
        setBoards(boardsData)
        
        // Set first board as current if available
        if (boardsData.length > 0) {
          setCurrentBoard(boardsData[0])
        }
        
        // Load rules
        const rules = await api.getRules()
        setRules(rules)
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: "Error loading data",
          description: "Failed to load board data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadInitialData()
  }, [])

  // Board management functions
  const handleBoardSelect = async (boardId: string) => {
    try {
      const board = await api.getBoardById(boardId)
      setCurrentBoard(board)
      setSidebarOpen(false) // Close sidebar on mobile after selection
      toast({
        title: "Board switched",
        description: `Switched to "${board.name}"`,
      })
    } catch (error) {
      console.error('Error loading board:', error)
      toast({
        title: "Error",
        description: "Failed to load board. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateBoard = async (name: string) => {
    try {
      const newBoard = await api.createBoard(name)
      setBoards([...boards, newBoard])
      setCurrentBoard(newBoard)
      toast({
        title: "Board created",
        description: `"${name}" board has been created`,
      })
    } catch (error) {
      console.error('Error creating board:', error)
      toast({
        title: "Error",
        description: "Failed to create board. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRenameBoard = async (boardId: string, newName: string) => {
    try {
      const updatedBoard = await api.updateBoard(boardId, { name: newName })
      setBoards(boards.map(board => 
        board.id === boardId ? updatedBoard : board
      ))
      if (currentBoard?.id === boardId) {
        setCurrentBoard(updatedBoard)
      }
      toast({
        title: "Board renamed",
        description: `Board renamed to "${newName}"`,
      })
    } catch (error) {
      console.error('Error renaming board:', error)
      toast({
        title: "Error",
        description: "Failed to rename board. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBoard = async (boardId: string) => {
    if (boards.length <= 1) {
      toast({
        title: "Cannot delete board",
        description: "You must have at least one board.",
        variant: "destructive",
      })
      return
    }

    try {
      await api.deleteBoard(boardId)
      const remainingBoards = boards.filter(board => board.id !== boardId)
      setBoards(remainingBoards)
      
      // If deleted board was current, switch to first available
      if (currentBoard?.id === boardId && remainingBoards.length > 0) {
        setCurrentBoard(remainingBoards[0])
      }
      
      toast({
        title: "Board deleted",
        description: "Board has been deleted",
      })
    } catch (error) {
      console.error('Error deleting board:', error)
      toast({
        title: "Error",
        description: "Failed to delete board. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Process automation rules
  useEffect(() => {
    if (!currentBoard || rules.length === 0) return

    // Only process enabled rules
    const enabledRules = rules.filter((rule) => rule.enabled)
    if (enabledRules.length === 0) return

    const tasksToMove: { taskId: string; sourceColumnId: string; targetColumnId: string }[] = []

    // Check each task against each rule
    currentBoard.columns.forEach((column) => {
      column.tasks.forEach((task) => {
        enabledRules.forEach((rule) => {
          const { condition, action } = rule
          let conditionMet = false

          // Check if condition is met
          if (condition.type === "due-date" && condition.operator === "is-overdue") {
            conditionMet = Boolean(task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed")
          } else if (condition.type === "subtasks-completed" && condition.operator === "all-completed") {
            conditionMet = task.subtasks.length > 0 && task.subtasks.every((subtask) => subtask.completed)
          } else if (condition.type === "custom-field" && condition.field) {
            const field = task.customFields.find((f) => f.name === condition.field)
            if (field) {
              if (condition.operator === "equals") {
                conditionMet = field.value === condition.value
              } else if (condition.operator === "not-equals") {
                conditionMet = field.value !== condition.value
              } else if (condition.operator === "contains") {
                conditionMet = field.value.includes(condition.value || "")
              }
            }
          }

          // If condition is met and task is not already in the target column
          if (conditionMet && action.type === "move-to-column") {
            const targetColumn = currentBoard.columns.find((col) => col.id === action.targetColumnId)
            if (targetColumn && task.status !== targetColumn.title) {
              tasksToMove.push({
                taskId: task.id,
                sourceColumnId: column.id,
                targetColumnId: action.targetColumnId,
              })
            }
          }
        })
      })
    })

    // Apply the moves
    if (tasksToMove.length > 0) {
      const newColumns = [...currentBoard.columns]

      tasksToMove.forEach(({ taskId, sourceColumnId, targetColumnId }) => {
        const sourceColIndex = newColumns.findIndex((col) => col.id === sourceColumnId)
        const targetColIndex = newColumns.findIndex((col) => col.id === targetColumnId)

        if (sourceColIndex !== -1 && targetColIndex !== -1) {
          const sourceCol = newColumns[sourceColIndex]
          const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId)

          if (taskIndex !== -1) {
            const task = { ...sourceCol.tasks[taskIndex], status: newColumns[targetColIndex].title }

            // Remove from source
            newColumns[sourceColIndex] = {
              ...sourceCol,
              tasks: sourceCol.tasks.filter((t) => t.id !== taskId),
            }

            // Add to target
            newColumns[targetColIndex] = {
              ...newColumns[targetColIndex],
              tasks: [...newColumns[targetColIndex].tasks, task],
            }

            // Update selected task if it's being moved
            if (selectedTask && selectedTask.id === taskId) {
              setSelectedTask(task)
            }

            toast({
              title: "Task moved automatically",
              description: `"${task.title}" moved to ${newColumns[targetColIndex].title} by rule: ${rules.find((r) => r.action.targetColumnId === targetColumnId)?.name}`,
            })
          }
        }
      })

      const updatedBoard = { ...currentBoard, columns: newColumns }
      setCurrentBoard(updatedBoard)
      setBoards(boards.map(board => 
        board.id === currentBoard.id ? updatedBoard : board
      ))
    }
  }, [currentBoard, rules, selectedTask, toast, boards])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Find the task being moved
    const task = sourceColumn.tasks.find((t) => t.id === draggableId)
    if (!task) return

    if (!currentBoard) return
    
    // Optimistically update UI
    const newColumns = [...currentBoard.columns]
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId)
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId)

    // Remove the task from the source column
    newColumns[sourceColIndex] = {
      ...sourceColumn,
      tasks: sourceColumn.tasks.filter((t) => t.id !== draggableId),
    }

    // Add the task to the destination column with updated status
    const updatedTask = { ...task, status: destColumn.title }
    newColumns[destColIndex] = {
      ...destColumn,
      tasks: [
        ...destColumn.tasks.slice(0, destination.index),
        updatedTask,
        ...destColumn.tasks.slice(destination.index),
      ],
    }

    const updatedBoard = { ...currentBoard, columns: newColumns }
    setCurrentBoard(updatedBoard)
    setBoards(boards.map(board => 
      board.id === currentBoard.id ? updatedBoard : board
    ))

    // Update selected task if it's the one being moved
    if (selectedTask && selectedTask.id === draggableId) {
      setSelectedTask(updatedTask)
    }

    try {
      await api.moveTask(draggableId, source.droppableId, destination.droppableId, destination.index)
      toast({
        title: "Task moved",
        description: `"${task.title}" moved to ${destColumn.title}`,
      })
    } catch (error) {
      // Revert optimistic update on error
      console.error('Error moving task:', error)
      toast({
        title: "Error",
        description: "Failed to move task. Please try again.",
        variant: "destructive",
      })
      // Reload data to ensure consistency
      if (currentBoard) {
        const board = await api.getBoardById(currentBoard.id)
        setCurrentBoard(board)
        setBoards(boards.map(b => 
          b.id === currentBoard.id ? board : b
        ))
      }
    }
  }

  const addTask = async (columnId: string, task: Task) => {
    if (!currentBoard) return
    
    try {
      const createdTask = await api.createTask(columnId, task)
      const newColumns = currentBoard.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, createdTask],
          }
        }
        return column
      })
      const updatedBoard = { ...currentBoard, columns: newColumns }
      setCurrentBoard(updatedBoard)
      setBoards(boards.map(board => 
        board.id === currentBoard.id ? updatedBoard : board
      ))
      toast({
        title: "Task created",
        description: `"${createdTask.title}" added to ${currentBoard.columns.find((col) => col.id === columnId)?.title}`,
      })
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateTask = async (updatedTask: Task) => {
    if (!currentBoard) return
    
    try {
      const updated = await api.updateTask(updatedTask.id, updatedTask)
      const newColumns = currentBoard.columns.map((column) => {
        return {
          ...column,
          tasks: column.tasks.map((task) => (task.id === updated.id ? updated : task)),
        }
      })
      const updatedBoard = { ...currentBoard, columns: newColumns }
      setCurrentBoard(updatedBoard)
      setBoards(boards.map(board => 
        board.id === currentBoard.id ? updatedBoard : board
      ))
      setSelectedTask(updated)
      toast({
        title: "Task updated",
        description: `"${updated.title}" has been updated`,
      })
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!currentBoard) return
    
    try {
      await api.deleteTask(taskId)
      const newColumns = currentBoard.columns.map((column) => {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        }
      })
      const updatedBoard = { ...currentBoard, columns: newColumns }
      setCurrentBoard(updatedBoard)
      setBoards(boards.map(board => 
        board.id === currentBoard.id ? updatedBoard : board
      ))
      setSelectedTask(null)
      toast({
        title: "Task deleted",
        description: "The task has been deleted",
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const duplicateTask = async (task: Task, columnId?: string) => {
    if (!currentBoard) return
    
    try {
      const targetColumnId = columnId || currentBoard.columns.find((col) => col.tasks.some((t) => t.id === task.id))?.id
      
      if (targetColumnId) {
        const duplicatedTask = await api.duplicateTask(task.id, targetColumnId)
        const newColumns = currentBoard.columns.map((column) => {
          if (column.id === targetColumnId) {
            return {
              ...column,
              tasks: [...column.tasks, duplicatedTask],
            }
          }
          return column
        })
        const updatedBoard = { ...currentBoard, columns: newColumns }
        setCurrentBoard(updatedBoard)
        setBoards(boards.map(board => 
          board.id === currentBoard.id ? updatedBoard : board
        ))
        toast({
          title: "Task duplicated",
          description: `"${duplicatedTask.title}" created`,
        })
      }
    } catch (error) {
      console.error('Error duplicating task:', error)
      toast({
        title: "Error",
        description: "Failed to duplicate task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addColumn = async () => {
    if (!newColumnTitle.trim()) {
      toast({
        title: "Error",
        description: "Column title cannot be empty",
        variant: "destructive",
      })
      return
    }

    if (!currentBoard) {
      toast({
        title: "Error",
        description: "No board selected",
        variant: "destructive",
      })
      return
    }

    try {
      const newColumn = await api.createColumn(currentBoard.id, newColumnTitle)
      const updatedBoard = { 
        ...currentBoard, 
        columns: [...currentBoard.columns, newColumn] 
      }
      setCurrentBoard(updatedBoard)
      setBoards(boards.map(board => 
        board.id === currentBoard.id ? updatedBoard : board
      ))
      setNewColumnTitle("")
      setIsAddingColumn(false)
      toast({
        title: "Column added",
        description: `"${newColumnTitle}" column has been added`,
      })
    } catch (error) {
      console.error('Error creating column:', error)
      toast({
        title: "Error",
        description: "Failed to create column. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateColumn = async (columnId: string, updates: Partial<ColumnType>) => {
    if (!currentBoard) return
    
    try {
      const updatedColumn = await api.updateColumn(currentBoard.id, columnId, updates)
      const newColumns = currentBoard.columns.map((column) => (column.id === columnId ? updatedColumn : column))
      const updatedBoard = { ...currentBoard, columns: newColumns }
      setCurrentBoard(updatedBoard)
      setBoards(boards.map(board => 
        board.id === currentBoard.id ? updatedBoard : board
      ))
    } catch (error) {
      console.error('Error updating column:', error)
      toast({
        title: "Error",
        description: "Failed to update column. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteColumn = async (columnId: string) => {
    if (!currentBoard) return
    
    // Check if column has tasks
    const column = currentBoard.columns.find((col) => col.id === columnId)
    if (column && column.tasks.length > 0) {
      toast({
        title: "Cannot delete column",
        description: "Please move or delete all tasks in this column first",
        variant: "destructive",
      })
      return
    }

    try {
      await api.deleteColumn(currentBoard.id, columnId)
      const newColumns = currentBoard.columns.filter((col) => col.id !== columnId)
      const updatedBoard = { ...currentBoard, columns: newColumns }
      setCurrentBoard(updatedBoard)
      setBoards(boards.map(board => 
        board.id === currentBoard.id ? updatedBoard : board
      ))
      toast({
        title: "Column deleted",
        description: `"${column?.title}" column has been deleted`,
      })
    } catch (error) {
      console.error('Error deleting column:', error)
      toast({
        title: "Error",
        description: "Failed to delete column. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addRule = async (rule: Rule) => {
    try {
      const createdRule = await api.createRule(rule)
      setRules([...rules, createdRule])
      toast({
        title: "Rule created",
        description: `"${createdRule.name}" has been added`,
      })
    } catch (error) {
      console.error('Error creating rule:', error)
      toast({
        title: "Error",
        description: "Failed to create rule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateRule = async (ruleId: string, updates: Partial<Rule>) => {
    try {
      const updatedRule = await api.updateRule(ruleId, updates)
      const newRules = rules.map((rule) => (rule.id === ruleId ? updatedRule : rule))
      setRules(newRules)
    } catch (error) {
      console.error('Error updating rule:', error)
      toast({
        title: "Error",
        description: "Failed to update rule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteRule = async (ruleId: string) => {
    try {
      await api.deleteRule(ruleId)
      setRules(rules.filter((rule) => rule.id !== ruleId))
      toast({
        title: "Rule deleted",
        description: "The automation rule has been deleted",
      })
    } catch (error) {
      console.error('Error deleting rule:', error)
      toast({
        title: "Error",
        description: "Failed to delete rule. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Board content for the "board" tab
  const renderBoardContent = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onAddTask={addTask}
            onTaskClick={setSelectedTask}
            onDeleteColumn={() => deleteColumn(column.id)}
            onUpdateColumn={updateColumn}
            onDuplicateTask={duplicateTask}
          />
        ))}

        <div className="shrink-0 w-72">
          {isAddingColumn ? (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border dark:border-gray-700">
              <Label htmlFor="column-title" className="dark:text-gray-200">
                Column Title
              </Label>
              <Input
                id="column-title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title"
                className="mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={addColumn}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingColumn(false)}
                  className="dark:border-gray-600 dark:text-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="border-dashed border-2 w-full h-12 dark:border-gray-700 dark:text-gray-300"
              onClick={() => setIsAddingColumn(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Column
            </Button>
          )}
        </div>
      </div>
    </DragDropContext>
  )

  // Automation content for the "automation" tab
  const renderAutomationContent = () => (
    <div className="max-w-4xl mx-auto">
      <AutomationRules
        rules={rules}
        columns={columns}
        onAddRule={addRule}
        onUpdateRule={updateRule}
        onDeleteRule={deleteRule}
      />
    </div>
  )

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-800">
        <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <Logo />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-800 relative">
      {/* Board Sidebar */}
      <BoardSidebar
        boards={boards}
        currentBoardId={currentBoardId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onBoardSelect={handleBoardSelect}
        onCreateBoard={handleCreateBoard}
        onRenameBoard={handleRenameBoard}
        onDeleteBoard={handleDeleteBoard}
      />
      
      {/* Main Content */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Logo />
              {currentBoard && (
                <h1 className="text-xl font-semibold text-white">
                  {currentBoard.name}
                </h1>
              )}
            </div>
            <ThemeToggle />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-700">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="mt-4">
              {currentBoard ? renderBoardContent() : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-400">
                    <p className="text-lg mb-2">No board selected</p>
                    <p className="text-sm">Create a new board or select an existing one from the sidebar</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="automation" className="mt-4">
              {renderAutomationContent()}
            </TabsContent>
          </Tabs>
        </header>

        {selectedTask && (
          <TaskDetailSidebar
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onDuplicate={duplicateTask}
            columns={columns}
          />
        )}
      </div>
    </div>
  )
}
