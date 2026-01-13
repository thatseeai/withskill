import { KPI } from '@/types/kpi'
import { KPICard } from './KPICard'

interface KPIGridProps {
  kpis: KPI[]
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      role="region"
      aria-label="Key Performance Indicators"
    >
      {kpis.map((kpi, index) => (
        <KPICard key={kpi.id} kpi={kpi} index={index} />
      ))}
    </div>
  )
}
