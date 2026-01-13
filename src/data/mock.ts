import { Incident, Severity, Status, TimelineEvent, Comment } from '@/types/incident'
import { seededRandom } from '@/utils/seed'
import { calculateDuration } from '@/utils/duration'

const services = [
  'API Gateway',
  'Auth Service',
  'Database Primary',
  'Redis Cache',
  'Message Queue',
  'Payment Service',
  'User Service',
  'Analytics Engine',
  'CDN',
  'Load Balancer',
]

const owners = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Williams',
  'David Brown',
  'Eve Davis',
  'Frank Miller',
  'Grace Wilson',
  'Henry Moore',
]

const incidentTitles = [
  'High latency in API responses',
  'Database connection pool exhausted',
  'Memory leak in service container',
  'Disk space critically low',
  'SSL certificate expiration warning',
  'Failed deployment rollback',
  'Cache invalidation not working',
  'Authentication service timeout',
  'Rate limiting not enforced',
  'Data replication lag detected',
  'Load balancer health check failing',
  'Message queue backlog growing',
  'CDN cache hit ratio dropped',
  'Database query timeout',
  'Service dependency unavailable',
  'Intermittent 500 errors',
  'Slow query performance degradation',
  'Connection refused errors',
  'Out of memory exception',
  'Network packet loss detected',
]

/**
 * Generate a random date within the last N days
 */
function generateDate(daysAgo: number): Date {
  const now = new Date()
  const randomDaysAgo = seededRandom.next() * daysAgo
  return new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000)
}

/**
 * Generate timeline events for an incident
 */
function generateTimeline(incident: Incident): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${incident.id}-timeline-1`,
      type: 'detected',
      timestamp: incident.started,
      description: `Incident detected by monitoring system`,
      user: 'System',
    },
  ]

  if (incident.status === Status.Monitoring || incident.status === Status.Resolved) {
    const mitigatedTime = new Date(
      incident.started.getTime() + seededRandom.nextInt(5, 30) * 60 * 1000
    )
    events.push({
      id: `${incident.id}-timeline-2`,
      type: 'mitigated',
      timestamp: mitigatedTime,
      description: `Initial mitigation applied`,
      user: incident.owner,
    })
  }

  if (incident.status === Status.Resolved && incident.resolved) {
    events.push({
      id: `${incident.id}-timeline-3`,
      type: 'resolved',
      timestamp: incident.resolved,
      description: `Incident fully resolved and verified`,
      user: incident.owner,
    })
  }

  return events
}

/**
 * Generate comments for an incident
 */
function generateComments(incident: Incident): Comment[] {
  const commentCount = seededRandom.nextInt(0, 5)
  const comments: Comment[] = []

  const commentTexts = [
    'Investigating the root cause now',
    'Applied temporary fix, monitoring the situation',
    'Identified the issue in the recent deployment',
    'Rolling back to previous version',
    'Customer impact appears to be minimal',
    'Setting up additional monitoring',
    'Post-mortem scheduled for tomorrow',
    'This is related to the previous incident last week',
  ]

  for (let i = 0; i < commentCount; i++) {
    const commentTime = new Date(
      incident.started.getTime() + (i + 1) * 10 * 60 * 1000
    )
    comments.push({
      id: `${incident.id}-comment-${i + 1}`,
      user: seededRandom.pick(owners),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      timestamp: commentTime,
      text: seededRandom.pick(commentTexts),
    })
  }

  return comments
}

/**
 * Generate 40+ mock incidents with varied data
 */
function generateIncidents(): Incident[] {
  const incidents: Incident[] = []
  const severities = [Severity.P0, Severity.P1, Severity.P2, Severity.P3]
  const statuses = [Status.Open, Status.Monitoring, Status.Resolved]

  // Generate 50 incidents for good variety
  for (let i = 0; i < 50; i++) {
    const severity = seededRandom.pick(severities)
    const status = seededRandom.pick(statuses)
    const started = generateDate(30) // Within last 30 days

    // Resolved incidents have an end date
    let resolved: Date | undefined
    let duration: number

    if (status === Status.Resolved) {
      const durationMins = seededRandom.nextInt(15, 480) // 15 mins to 8 hours
      resolved = new Date(started.getTime() + durationMins * 60 * 1000)
      duration = durationMins
    } else {
      // Ongoing incidents
      duration = calculateDuration(started)
    }

    const incident: Incident = {
      id: `INC-${String(i + 1).padStart(4, '0')}`,
      title: seededRandom.pick(incidentTitles),
      service: seededRandom.pick(services),
      severity,
      status,
      started,
      resolved,
      duration,
      owner: seededRandom.pick(owners),
      description: `Detailed description for incident ${i + 1}. This incident was detected by our monitoring system and is being actively investigated.`,
      timeline: [],
      comments: [],
    }

    // Generate timeline and comments
    incident.timeline = generateTimeline(incident)
    incident.comments = generateComments(incident)

    incidents.push(incident)
  }

  // Sort by started date (most recent first)
  return incidents.sort((a, b) => b.started.getTime() - a.started.getTime())
}

// Export singleton data
export const mockIncidents = generateIncidents()

// Helper to get incident by ID
export function getIncidentById(id: string): Incident | undefined {
  return mockIncidents.find((inc) => inc.id === id)
}
