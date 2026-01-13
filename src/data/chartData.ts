import { IncidentCountData, LatencyData } from '@/types/chart'
import { mockIncidents } from './mock'
import { Severity } from '@/types/incident'
import { formatShortDate } from '@/utils/dateFormat'
import { seededRandom } from '@/utils/seed'

/**
 * Generate 7-day incident count data grouped by severity
 */
export function getIncidentCountData(): IncidentCountData[] {
  const data: IncidentCountData[] = []
  const now = new Date()

  // Generate data for last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    // Count incidents that started on this day by severity
    const dayIncidents = mockIncidents.filter(
      (inc) => inc.started >= date && inc.started < nextDate
    )

    data.push({
      date: formatShortDate(date),
      P0: dayIncidents.filter((inc) => inc.severity === Severity.P0).length,
      P1: dayIncidents.filter((inc) => inc.severity === Severity.P1).length,
      P2: dayIncidents.filter((inc) => inc.severity === Severity.P2).length,
      P3: dayIncidents.filter((inc) => inc.severity === Severity.P3).length,
    })
  }

  return data
}

/**
 * Generate 24-hour latency data (p50 and p95)
 * This is mock data with realistic patterns
 */
export function getLatencyData(): LatencyData[] {
  const data: LatencyData[] = []

  // Generate hourly data for last 24 hours
  for (let i = 23; i >= 0; i--) {
    const hour = 23 - i

    // Simulate latency patterns: higher during business hours (9-17)
    const baseLatency = hour >= 9 && hour <= 17 ? 80 : 50
    const variance = seededRandom.next() * 30

    const p50 = Math.round(baseLatency + variance)
    const p95 = Math.round(p50 * 2.5 + seededRandom.next() * 50)

    data.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      p50,
      p95,
    })
  }

  return data
}
