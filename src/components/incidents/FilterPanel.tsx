import { useState } from 'react'
import { Search, X, Filter, ChevronDown } from 'lucide-react'
import { Severity } from '@/types/incident'
import { getSeverityColor } from '@/utils/severity'
import { cn } from '@/lib/utils'

interface FilterState {
  severities: Severity[]
  status: string
  dateRange: string
  search: string
}

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  activeFilterCount: number
}

export function FilterPanel({ filters, onFiltersChange, activeFilterCount }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const severityOptions = [
    { value: Severity.P0, label: 'P0' },
    { value: Severity.P1, label: 'P1' },
    { value: Severity.P2, label: 'P2' },
    { value: Severity.P3, label: 'P3' },
  ]

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Open', label: 'Open' },
    { value: 'Monitoring', label: 'Monitoring' },
    { value: 'Resolved', label: 'Resolved' },
  ]

  const dateRangeOptions = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
  ]

  const toggleSeverity = (severity: Severity) => {
    const newSeverities = filters.severities.includes(severity)
      ? filters.severities.filter((s) => s !== severity)
      : [...filters.severities, severity]
    onFiltersChange({ ...filters, severities: newSeverities })
  }

  const handleReset = () => {
    onFiltersChange({
      severities: [],
      status: 'all',
      dateRange: '7d',
      search: '',
    })
    // Announce to screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = 'Filters reset'
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        aria-expanded={isOpen}
        aria-controls="filter-content"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-cyan-500 text-white text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Filter Content */}
      <div
        id="filter-content"
        className={cn(
          'lg:block',
          isOpen ? 'block' : 'hidden'
        )}
      >
        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                placeholder="Search incidents..."
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                aria-label="Search incidents by title or owner"
              />
              {filters.search && (
                <button
                  onClick={() => onFiltersChange({ ...filters, search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium mb-3">Severity</label>
            <div className="flex flex-wrap gap-2">
              {severityOptions.map((option) => {
                const isSelected = filters.severities.includes(option.value)
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleSeverity(option.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-semibold border transition-all duration-200',
                      isSelected
                        ? getSeverityColor(option.value)
                        : 'bg-muted/50 text-muted-foreground border-border hover:border-border/80'
                    )}
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-label={`Filter by severity ${option.label}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status-select" className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status-select"
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
              aria-label="Filter by incident status"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label htmlFor="date-range-select" className="block text-sm font-medium mb-2">
              Date Range
            </label>
            <select
              id="date-range-select"
              value={filters.dateRange}
              onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
              aria-label="Filter by date range"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              aria-label="Reset all filters"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
