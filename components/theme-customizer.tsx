"use client"

import { useEffect, useState } from "react"
import { Check, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

type Theme = "zinc" | "blue" | "green" | "orange" | "red" | "violet"

interface ThemeCustomizerProps {
  className?: string
}

export function ThemeCustomizer({ className }: ThemeCustomizerProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<Theme>("zinc")

  // Define theme colors
  const themes: { name: string; value: Theme; label: string }[] = [
    {
      name: "Default",
      value: "zinc",
      label: "Zinc",
    },
    {
      name: "Green",
      value: "green",
      label: "Green",
    },
    {
      name: "Blue",
      value: "blue",
      label: "Blue",
    },
    {
      name: "Orange",
      value: "orange",
      label: "Orange",
    },
    {
      name: "Red",
      value: "red",
      label: "Red",
    },
    {
      name: "Violet",
      value: "violet",
      label: "Violet",
    },
  ]

  // Update the theme CSS variables when the theme changes
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("app-theme") as Theme
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
    }
  }, [])

  // Handle theme change
  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("app-theme", theme)
  }

  // Reset theme to default
  const resetTheme = () => {
    setCurrentTheme("zinc")
    document.documentElement.setAttribute("data-theme", "zinc")
    localStorage.removeItem("app-theme")
  }

  if (!mounted) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          Customize
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Theme Customizer</h4>
            <p className="text-xs text-muted-foreground">Customize your components colors.</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Color</h4>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => (
                <Button
                  key={t.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleThemeChange(t.value)}
                  className={`justify-start ${currentTheme === t.value ? "border-2 border-primary" : ""}`}
                >
                  <span className="mr-1">{currentTheme === t.value && <Check className="h-3 w-3" />}</span>
                  {t.name}
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Mode</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("light")}
                className={`justify-start ${theme === "light" ? "border-2 border-primary" : ""}`}
              >
                <Sun className="h-3 w-3 mr-1" />
                Light
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("dark")}
                className={`justify-start ${theme === "dark" ? "border-2 border-primary" : ""}`}
              >
                <Moon className="h-3 w-3 mr-1" />
                Dark
              </Button>
            </div>
          </div>
          <Separator />
          <Button variant="outline" size="sm" onClick={resetTheme}>
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

