/**
 * Calculate duration between two dates in minutes
 */
export function calculateDuration(start: Date, end: Date = new Date()): number {
  const diffMs = end.getTime() - start.getTime()
  return Math.floor(diffMs / (1000 * 60))
}

/**
 * Parse duration string (e.g., "2h 30m") to minutes
 */
export function parseDuration(duration: string): number {
  const hourMatch = duration.match(/(\d+)h/)
  const minMatch = duration.match(/(\d+)m/)

  const hours = hourMatch ? parseInt(hourMatch[1]) : 0
  const minutes = minMatch ? parseInt(minMatch[1]) : 0

  return hours * 60 + minutes
}
