import { useNavigate } from 'react-router-dom'
import { Incident } from '@/types/incident'
import { SeverityBadge, StatusBadge } from '@/components/common/StatusBadge'
import { formatRelativeTime } from '@/utils/dateFormat'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentIncidentsTableProps {
  incidents: Incident[]
  limit?: number
}

export function RecentIncidentsTable({ incidents, limit = 5 }: RecentIncidentsTableProps) {
  const navigate = useNavigate()
  const recentIncidents = incidents.slice(0, limit)

  const handleRowClick = (incidentId: string) => {
    navigate(`/incidents?selected=${incidentId}`)
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent Incidents</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Latest incidents requiring attention
            </p>
          </div>
          <button
            onClick={() => navigate('/incidents')}
            className="inline-flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
            aria-label="View all incidents"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
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
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Started
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Owner
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {recentIncidents.map((incident) => (
              <tr
                key={incident.id}
                onClick={() => handleRowClick(incident.id)}
                className={cn(
                  'group cursor-pointer transition-colors duration-200',
                  'hover:bg-cyan-500/5 focus-within:bg-cyan-500/5'
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleRowClick(incident.id)
                  }
                }}
                aria-label={`View incident ${incident.id}: ${incident.title}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono font-medium text-cyan-600 dark:text-cyan-400 group-hover:underline">
                    {incident.id}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium max-w-md truncate">
                    {incident.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {incident.service}
                  </div>
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
                  <span className="text-sm">{incident.owner}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
