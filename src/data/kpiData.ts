import { KPI } from '@/types/kpi'
import { mockIncidents } from './mock'
import { Status } from '@/types/incident'

/**
 * Calculate open incidents count
 */
function getOpenIncidentsCount(): number {
  return mockIncidents.filter((inc) => inc.status === Status.Open).length
}

/**
 * Calculate Mean Time To Resolve (MTTR) in minutes
 */
function calculateMTTR(): number {
  const resolvedIncidents = mockIncidents.filter(
    (inc) => inc.status === Status.Resolved && inc.resolved
  )
  if (resolvedIncidents.length === 0) return 0

  const totalDuration = resolvedIncidents.reduce((sum, inc) => sum + inc.duration, 0)
  return Math.round(totalDuration / resolvedIncidents.length)
}

/**
 * Count deploys in last 7 days (mock)
 */
function getRecentDeploys(): number {
  // Mock: randomly generated but consistent
  return 23
}

/**
 * Generate KPI data
 */
export function getKPIData(): KPI[] {
  const openIncidents = getOpenIncidentsCount()
  const mttr = calculateMTTR()

  return [
    {
      id: 'uptime',
      title: 'Uptime',
      value: '99.8%',
      delta: 0.2,
      deltaType: 'increase',
      description: 'System uptime over the last 30 days',
      icon: 'Activity',
      goodDirection: 'up',
    },
    {
      id: 'open-incidents',
      title: 'Open Incidents',
      value: openIncidents,
      delta: -3,
      deltaType: 'decrease',
      description: 'Currently active incidents requiring attention',
      icon: 'AlertCircle',
      goodDirection: 'down',
    },
    {
      id: 'mttr',
      title: 'MTTR',
      value: `${mttr}m`,
      delta: 5,
      deltaType: 'increase',
      description: 'Mean Time To Resolve incidents',
      icon: 'Clock',
      goodDirection: 'down',
    },
    {
      id: 'deploys',
      title: 'Deploys (7d)',
      value: getRecentDeploys(),
      delta: 7,
      deltaType: 'increase',
      description: 'Successful deployments in the last 7 days',
      icon: 'Rocket',
      goodDirection: 'up',
    },
  ]
}
