import { Severity, Status } from '@/types/incident'
import { getSeverityColor, getSeverityLabel } from '@/utils/severity'
import { getStatusColor, getStatusLabel } from '@/utils/status'
import { cn } from '@/lib/utils'

interface SeverityBadgeProps {
  severity: Severity
  className?: string
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border',
        getSeverityColor(severity),
        className
      )}
      aria-label={`Severity: ${getSeverityLabel(severity)}`}
    >
      {getSeverityLabel(severity)}
    </span>
  )
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
        getStatusColor(status),
        className
      )}
      aria-label={`Status: ${getStatusLabel(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}
