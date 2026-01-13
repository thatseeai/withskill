import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light Mode' },
    { value: 'dark' as const, icon: Moon, label: 'Dark Mode' },
    { value: 'system' as const, icon: Monitor, label: 'System Theme' },
  ]

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'relative p-2 rounded-md transition-all duration-300',
            'hover:bg-background/80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
            theme === value && 'bg-background shadow-sm'
          )}
          aria-label={label}
          aria-pressed={theme === value}
        >
          <Icon
            className={cn(
              'h-4 w-4 transition-all duration-300',
              theme === value
                ? 'text-cyan-500 scale-110'
                : 'text-muted-foreground scale-100'
            )}
          />
          {theme === value && (
            <div
              className="absolute inset-0 rounded-md bg-cyan-500/10 animate-pulse"
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </div>
  )
}
