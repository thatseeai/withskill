import { Severity } from '@/types/incident'

/**
 * Get Tailwind color classes for severity
 */
export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case Severity.P0:
      return 'bg-red-500 text-white border-red-600'
    case Severity.P1:
      return 'bg-orange-500 text-white border-orange-600'
    case Severity.P2:
      return 'bg-yellow-500 text-black border-yellow-600'
    case Severity.P3:
      return 'bg-blue-500 text-white border-blue-600'
  }
}

/**
 * Get severity label
 */
export function getSeverityLabel(severity: Severity): string {
  return severity
}

/**
 * Get lucide icon name for severity
 */
export function getSeverityIcon(severity: Severity): string {
  switch (severity) {
    case Severity.P0:
      return 'AlertCircle'
    case Severity.P1:
      return 'AlertTriangle'
    case Severity.P2:
      return 'Info'
    case Severity.P3:
      return 'CircleDot'
  }
}

/**
 * Get numeric severity for sorting (P0 = 0, P1 = 1, etc.)
 */
export function getSeverityOrder(severity: Severity): number {
  return parseInt(severity.replace('P', ''))
}
