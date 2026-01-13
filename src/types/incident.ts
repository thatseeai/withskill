export enum Severity {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
}

export enum Status {
  Open = 'Open',
  Monitoring = 'Monitoring',
  Resolved = 'Resolved',
}

export interface Incident {
  id: string
  title: string
  service: string
  severity: Severity
  status: Status
  started: Date
  resolved?: Date
  duration: number // in minutes
  owner: string
  description: string
  timeline?: TimelineEvent[]
  comments?: Comment[]
}

export interface TimelineEvent {
  id: string
  type: 'detected' | 'mitigated' | 'resolved'
  timestamp: Date
  description: string
  user: string
}

export interface Comment {
  id: string
  user: string
  avatar: string
  timestamp: Date
  text: string
}
