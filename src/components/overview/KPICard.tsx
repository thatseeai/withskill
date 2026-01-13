import { TrendingUp, TrendingDown } from 'lucide-react'
import { KPI } from '@/types/kpi'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

interface KPICardProps {
  kpi: KPI
  index?: number
}

export function KPICard({ kpi, index = 0 }: KPICardProps) {
  const Icon = (Icons as any)[kpi.icon] || Icons.Activity

  // Determine if delta is good or bad based on direction preference
  const isPositive =
    (kpi.goodDirection === 'up' && kpi.deltaType === 'increase') ||
    (kpi.goodDirection === 'down' && kpi.deltaType === 'decrease')

  const deltaColor = isPositive
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'

  const DeltaIcon = kpi.deltaType === 'increase' ? TrendingUp : TrendingDown

  return (
    <div
      className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'slideUp 0.6s ease-out forwards',
      }}
      role="article"
      aria-label={`${kpi.title}: ${kpi.value}`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative">
        {/* Header: Icon and Delta */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative rounded-lg bg-cyan-500/10 p-3 ring-1 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all duration-300">
              <Icon
                className="h-5 w-5 text-cyan-600 dark:text-cyan-400"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Delta indicator */}
          <div
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium font-mono',
              isPositive
                ? 'bg-green-500/10 ring-1 ring-green-500/20'
                : 'bg-red-500/10 ring-1 ring-red-500/20'
            )}
            aria-label={`Change: ${kpi.deltaType === 'increase' ? '+' : '-'}${Math.abs(kpi.delta)}`}
          >
            <DeltaIcon className={cn('h-3 w-3', deltaColor)} />
            <span className={deltaColor}>
              {kpi.delta > 0 ? '+' : ''}{kpi.delta}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h3
            className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
            title={kpi.description}
          >
            {kpi.title}
          </h3>
        </div>

        {/* Value */}
        <div className="mb-1">
          <p
            className="text-3xl font-bold tracking-tight tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text"
            aria-live="polite"
          >
            {kpi.value}
          </p>
        </div>

        {/* Description on hover */}
        <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {kpi.description}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}

// Add keyframe animation
const style = document.createElement('style')
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
