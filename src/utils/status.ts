import { Status } from '@/types/incident'

/**
 * Get Tailwind color classes for status
 */
export function getStatusColor(status: Status): string {
  switch (status) {
    case Status.Open:
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200'
    case Status.Monitoring:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200'
    case Status.Resolved:
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200'
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: Status): string {
  return status
}

/**
 * Get lucide icon name for status
 */
export function getStatusIcon(status: Status): string {
  switch (status) {
    case Status.Open:
      return 'Circle'
    case Status.Monitoring:
      return 'Eye'
    case Status.Resolved:
      return 'CheckCircle2'
  }
}
