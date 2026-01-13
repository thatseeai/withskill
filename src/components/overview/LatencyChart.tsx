import { useTheme } from '@/contexts/ThemeContext'
import { LatencyData } from '@/types/chart'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface LatencyChartProps {
  data: LatencyData[]
}

export function LatencyChart({ data }: LatencyChartProps) {
  const { effectiveTheme } = useTheme()
  const isDark = effectiveTheme === 'dark'

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="text-sm font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-xs font-medium tabular-nums">{item.value}ms</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 hover:border-cyan-500/50 transition-colors duration-500">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Request Latency</h3>
        <p className="text-sm text-muted-foreground">
          24-hour latency metrics (p50 & p95)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)'}
            opacity={0.5}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: isDark ? 'hsl(215 20% 65%)' : 'hsl(215 16% 47%)', fontSize: 12 }}
            tickLine={{ stroke: isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)' }}
            axisLine={{ stroke: isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)' }}
            interval="preserveStartEnd"
            tickFormatter={(value) => {
              const hour = parseInt(value.split(':')[0])
              return hour % 6 === 0 ? value : ''
            }}
          />
          <YAxis
            tick={{ fill: isDark ? 'hsl(215 20% 65%)' : 'hsl(215 16% 47%)', fontSize: 12 }}
            tickLine={{ stroke: isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)' }}
            axisLine={{ stroke: isDark ? 'hsl(217 33% 17%)' : 'hsl(214 32% 91%)' }}
            label={{
              value: 'Latency (ms)',
              angle: -90,
              position: 'insideLeft',
              style: {
                fill: isDark ? 'hsl(215 20% 65%)' : 'hsl(215 16% 47%)',
                fontSize: 12,
              },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
            }}
            iconType="circle"
            iconSize={8}
          />
          <Line
            type="monotone"
            dataKey="p50"
            name="p50"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#06b6d4' }}
          />
          <Line
            type="monotone"
            dataKey="p95"
            name="p95"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
