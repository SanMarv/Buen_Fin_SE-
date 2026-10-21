import { Moon, Sun } from 'lucide-react'
import { Button } from '../ui/button'

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  } catch {}
}

export function Controls() {
  return (
    <div className="mt-auto flex gap-2 px-4 pb-4">
      <Button
        variant="outline"
        size="icon"
        aria-label="Modo oscuro"
        onClick={toggleTheme}
      >
        <Moon className="dark:hidden" />
        <Sun className="hidden dark:block" />
      </Button>
    </div>
  )
}
