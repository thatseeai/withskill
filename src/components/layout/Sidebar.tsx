import { NavLink } from 'react-router-dom'
import { LayoutDashboard, AlertCircle, Settings, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

const navigationItems = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Overview',
    description: 'System health & metrics',
  },
  {
    to: '/incidents',
    icon: AlertCircle,
    label: 'Incidents',
    description: 'Active & resolved issues',
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
    description: 'Preferences & config',
  },
]

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 border-r border-border/40 bg-background transition-transform duration-300 ease-out',
          'lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:z-30',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          !isMobile && 'lg:block'
        )}
        aria-label="Main navigation"
      >
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-border/40 lg:hidden">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300',
                  'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full animate-in slide-in-from-left duration-300" />
                  )}

                  {/* Icon with glow effect when active */}
                  <div className="relative flex-shrink-0">
                    <item.icon
                      className={cn(
                        'h-5 w-5 transition-all duration-300',
                        isActive && 'scale-110'
                      )}
                    />
                    {isActive && (
                      <div
                        className="absolute inset-0 bg-cyan-500 blur-lg opacity-30 animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Label and description */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors duration-300',
                        isActive && 'font-semibold'
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        'text-xs transition-all duration-300',
                        isActive
                          ? 'text-cyan-600/70 dark:text-cyan-400/70'
                          : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                      )}
                    >
                      {item.description}
                    </span>
                  </div>

                  {/* Animated chevron for active state */}
                  {isActive && (
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex gap-1">
              <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
              <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse delay-75" />
              <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse delay-150" />
            </div>
            <span className="font-mono">System Monitor Active</span>
          </div>
        </div>
      </aside>
    </>
  )
}
