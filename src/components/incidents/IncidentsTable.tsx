import { Incident, Severity } from '@/types/incident'
import { SeverityBadge, StatusBadge } from '@/components/common/StatusBadge'
import { formatRelativeTime, formatDuration } from '@/utils/dateFormat'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type SortColumn = 'started' | 'severity' | 'duration'
type SortDirection = 'asc' | 'desc'

interface IncidentsTableProps {
  incidents: Incident[]
  selectedId?: string | null
  onRowClick: (incident: Incident) => void
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

export function IncidentsTable({
  incidents,
  selectedId,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
}: IncidentsTableProps) {
  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-cyan-500" />
    ) : (
      <ArrowDown className="h-4 w-4 text-cyan-500" />
    )
  }

  const getSortAriaSort = (column: SortColumn) => {
    if (sortColumn !== column) return 'none'
    return sortDirection === 'asc' ? 'ascending' : 'descending'
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-b border-border/50 bg-muted/10">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Service
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                aria-sort={getSortAriaSort('severity')}
              >
                <button
                  onClick={() => onSort('severity')}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                  aria-label="Sort by severity"
                >
                  Severity
                  <SortIcon column="severity" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                aria-sort={getSortAriaSort('started')}
              >
                <button
                  onClick={() => onSort('started')}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                  aria-label="Sort by start time"
                >
                  Started
                  <SortIcon column="started" />
                </button>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                aria-sort={getSortAriaSort('duration')}
              >
                <button
                  onClick={() => onSort('duration')}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                  aria-label="Sort by duration"
                >
                  Duration
                  <SortIcon column="duration" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Owner
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {incidents.map((incident) => {
              const isSelected = selectedId === incident.id

              return (
                <tr
                  key={incident.id}
                  onClick={() => onRowClick(incident)}
                  className={cn(
                    'group cursor-pointer transition-all duration-200',
                    isSelected
                      ? 'bg-cyan-500/10 ring-2 ring-inset ring-cyan-500/50'
                      : 'hover:bg-cyan-500/5'
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onRowClick(incident)
                    }
                  }}
                  aria-label={`View details for incident ${incident.id}: ${incident.title}`}
                  aria-selected={isSelected}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'text-sm font-mono font-medium transition-colors',
                        isSelected
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-cyan-600 dark:text-cyan-400 group-hover:underline'
                      )}
                    >
                      {incident.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm font-medium truncate">
                      {incident.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-muted-foreground">
                      {incident.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SeverityBadge severity={incident.severity} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-muted-foreground">
                      {formatRelativeTime(incident.started)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatDuration(incident.duration)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm">{incident.owner}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
