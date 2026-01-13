import { useState } from 'react'
import { Sun, Moon, Monitor, Check, RotateCcw } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSettings } from '@/contexts/SettingsContext'
import { Theme, Density } from '@/types/settings'
import { cn } from '@/lib/utils'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings, resetSettings } = useSettings()
  const [showToast, setShowToast] = useState(false)

  const handleReset = () => {
    resetSettings()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const showSavedToast = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const themeOptions: Array<{ value: Theme; icon: typeof Sun; label: string }> = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ]

  const densityOptions: Array<{ value: Density; label: string; description: string }> = [
    { value: 'comfortable', label: 'Comfortable', description: 'More spacing, easier to scan' },
    { value: 'compact', label: 'Compact', description: 'Denser layout, more content visible' },
  ]

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your dashboard preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Appearance Section */}
        <section
          className="rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5"
          aria-labelledby="appearance-heading"
        >
          <div className="mb-6">
            <h2 id="appearance-heading" className="text-lg font-semibold mb-1">
              Appearance
            </h2>
            <p className="text-sm text-muted-foreground">
              Customize how OpsPulse looks
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium block mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map(({ value, icon: Icon, label }) => {
                const isSelected = theme === value
                return (
                  <button
                    key={value}
                    onClick={() => {
                      setTheme(value)
                      showSavedToast()
                    }}
                    className={cn(
                      'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300',
                      'hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-border bg-background'
                    )}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Select ${label} theme`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                    <Icon
                      className={cn(
                        'h-6 w-6 transition-colors duration-300',
                        isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors duration-300',
                        isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-foreground'
                      )}
                    >
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Display Section */}
        <section
          className="rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5"
          aria-labelledby="display-heading"
        >
          <div className="mb-6">
            <h2 id="display-heading" className="text-lg font-semibold mb-1">
              Display
            </h2>
            <p className="text-sm text-muted-foreground">
              Adjust information density
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium block">Density</label>
            <div className="space-y-3">
              {densityOptions.map(({ value, label, description }) => {
                const isSelected = settings.density === value
                return (
                  <button
                    key={value}
                    onClick={() => {
                      updateSettings({ density: value })
                      showSavedToast()
                    }}
                    className={cn(
                      'relative w-full text-left p-4 rounded-lg border-2 transition-all duration-300',
                      'hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-border bg-background'
                    )}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Select ${label} density`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div
                          className={cn(
                            'font-medium mb-1 transition-colors duration-300',
                            isSelected && 'text-cyan-600 dark:text-cyan-400'
                          )}
                        >
                          {label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {description}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0 ml-3">
                          <div className="h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground italic">
              Affects table row spacing and component sizes
            </p>
          </div>
        </section>

        {/* Notifications Section */}
        <section
          className="rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 lg:col-span-2"
          aria-labelledby="notifications-heading"
        >
          <div className="mb-6">
            <h2 id="notifications-heading" className="text-lg font-semibold mb-1">
              Notifications
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage notification preferences
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <label
                  htmlFor="email-notifications"
                  className="text-sm font-medium block mb-1 cursor-pointer"
                >
                  Email notifications
                </label>
                <p className="text-xs text-muted-foreground">
                  Receive incident alerts via email
                </p>
              </div>
              <button
                id="email-notifications"
                role="switch"
                aria-checked={settings.notifications.email}
                onClick={() => {
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      email: !settings.notifications.email,
                    },
                  })
                  showSavedToast()
                }}
                className={cn(
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
                  settings.notifications.email ? 'bg-cyan-500' : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ease-in-out',
                    settings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            {/* Slack Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <label
                  htmlFor="slack-notifications"
                  className="text-sm font-medium block mb-1 cursor-pointer"
                >
                  Slack notifications
                </label>
                <p className="text-xs text-muted-foreground">
                  Receive incident alerts via Slack
                </p>
              </div>
              <button
                id="slack-notifications"
                role="switch"
                aria-checked={settings.notifications.slack}
                onClick={() => {
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      slack: !settings.notifications.slack,
                    },
                  })
                  showSavedToast()
                }}
                className={cn(
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
                  settings.notifications.slack ? 'bg-cyan-500' : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ease-in-out',
                    settings.notifications.slack ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Reset Button */}
      <div className="mt-8 max-w-5xl">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-red-200 dark:border-red-900 bg-background hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Reset all settings to default values"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300"
          role="status"
          aria-live="polite"
        >
          <div className="rounded-lg border border-border bg-card shadow-lg px-6 py-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Settings saved</p>
              <p className="text-xs text-muted-foreground">Your preferences have been updated</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
