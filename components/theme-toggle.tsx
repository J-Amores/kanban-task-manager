"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface ThemeToggleProps {
  isCompact?: boolean
}

export function ThemeToggle({ isCompact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="flex items-center justify-center gap-2 bg-secondary rounded-md p-2 w-full">
      {!isCompact && (
        <div className="flex items-center justify-between w-full">
          <Sun size={18} className="text-muted-foreground" />
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
          <Moon size={18} className="text-muted-foreground" />
        </div>
      )}
      {isCompact && <Switch checked={isDark} onCheckedChange={toggleTheme} />}
    </div>
  )
}
