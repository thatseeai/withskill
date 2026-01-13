import { Menu, Activity, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onMenuClick: () => void
  isMobileMenuOpen: boolean
}

export function Header({ onMenuClick, isMobileMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu + Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-all duration-300',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
              isMobileMenuOpen && 'bg-cyan-500/10'
            )}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                isMobileMenuOpen && 'rotate-90'
              )}
            />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center">
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-lg bg-cyan-500/20 animate-pulse" />
              <div className="absolute inset-0 rounded-lg border-2 border-cyan-500/50" />
              <Activity className="h-5 w-5 text-cyan-500 relative z-10" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                OpsPulse
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Theme toggle + User menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User Menu */}
          <button
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
              'border border-border/50'
            )}
            aria-label="User menu"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
              OP
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </button>
        </div>
      </div>

      {/* Animated accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </header>
  )
}
