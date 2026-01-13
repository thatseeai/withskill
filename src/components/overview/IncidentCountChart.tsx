import { useTheme } from '@/contexts/ThemeContext'
import { IncidentCountData } from '@/types/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface IncidentCountChartProps {
  data: IncidentCountData[]
}

export function IncidentCountChart({ data }: IncidentCountChartProps) {
  const { effectiveTheme } = useTheme()
  const isDark = effectiveTheme === 'dark'

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, item: any) => sum + item.value, 0)
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="text-sm font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            {payload.reverse().map((item: any) => (
              <div key={item.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.dataKey}</span>
                </div>
                <span className="text-xs font-medium tabular-nums">{item.value}</span>
              </div>
            ))}
            <div className="pt-1 mt-1 border-t border-border/50 flex justify-between">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-xs font-bold tabular-nums">{total}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 hover:border-cyan-500/50 transition-colors duration-500">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Incident Trends</h3>
        <p className="text-sm text-muted-foreground">
          7-day incident count by severity level
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)'}
            opacity={0.5}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: isDark ? 'hsl(215 20% 65%)' : 'hsl(215 16% 47%)', fontSize: 12 }}
            tickLine={{ stroke: isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)' }}
            axisLine={{ stroke: isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)' }}
          />
          <YAxis
            tick={{ fill: isDark ? 'hsl(215 20% 65%)' : 'hsl(215 16% 47%)', fontSize: 12 }}
            tickLine={{ stroke: isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)' }}
            axisLine={{ stroke: isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)' }}
            label={{
              value: 'Incidents',
              angle: -90,
              position: 'insideLeft',
              style: {
                fill: isDark ? 'hsl(215 20% 65%)' : 'hsl(215 16% 47%)',
                fontSize: 12,
              },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(189 95% 42% / 0.1)' }} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
            }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="P0" stackId="incidents" fill="#ef4444" radius={[0, 0, 0, 0]} />
          <Bar dataKey="P1" stackId="incidents" fill="#f97316" radius={[0, 0, 0, 0]} />
          <Bar dataKey="P2" stackId="incidents" fill="#eab308" radius={[0, 0, 0, 0]} />
          <Bar dataKey="P3" stackId="incidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
