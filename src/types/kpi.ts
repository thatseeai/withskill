export interface KPI {
  id: string
  title: string
  value: string | number
  delta: number // percentage or absolute change
  deltaType: 'increase' | 'decrease'
  description: string
  icon: string // lucide icon name
  goodDirection: 'up' | 'down' // which direction is positive
}
