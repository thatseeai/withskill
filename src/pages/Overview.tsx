import { useMockData } from '@/hooks/useMockData'
import { getKPIData } from '@/data/kpiData'
import { getIncidentCountData, getLatencyData } from '@/data/chartData'
import { mockIncidents } from '@/data/mock'
import { KPIGrid } from '@/components/overview/KPIGrid'
import { IncidentCountChart } from '@/components/overview/IncidentCountChart'
import { LatencyChart } from '@/components/overview/LatencyChart'
import { RecentIncidentsTable } from '@/components/overview/RecentIncidentsTable'
import { KPICardSkeleton, ChartSkeleton, TableSkeleton } from '@/components/common/LoadingSkeleton'
import { ErrorState } from '@/components/common/ErrorState'

export default function Overview() {
  // Simulate async data loading
  const { data: kpis, loading: kpisLoading, error: kpisError, refetch: refetchKpis } = useMockData(
    () => getKPIData(),
    500
  )

  const { data: incidentCountData, loading: chartLoading, error: chartError } = useMockData(
    () => getIncidentCountData(),
    600
  )

  const { data: latencyData } = useMockData(
    () => getLatencyData(),
    650
  )

  const { data: incidents, loading: incidentsLoading, error: incidentsError } = useMockData(
    () => mockIncidents,
    700
  )

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          System health metrics and recent activity
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:space-y-8">
        {/* KPI Cards */}
        {kpisError ? (
          <ErrorState
            title="Failed to load KPIs"
            message={kpisError.message}
            onRetry={refetchKpis}
          />
        ) : kpisLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <KPICardSkeleton key={i} />
            ))}
          </div>
        ) : kpis ? (
          <KPIGrid kpis={kpis} />
        ) : null}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Count Chart */}
          {chartError ? (
            <ErrorState
              title="Failed to load chart"
              message={chartError.message}
            />
          ) : chartLoading || !incidentCountData ? (
            <ChartSkeleton />
          ) : (
            <IncidentCountChart data={incidentCountData} />
          )}

          {/* Latency Chart */}
          {chartLoading || !latencyData ? (
            <ChartSkeleton />
          ) : (
            <LatencyChart data={latencyData} />
          )}
        </div>

        {/* Recent Incidents Table */}
        {incidentsError ? (
          <ErrorState
            title="Failed to load incidents"
            message={incidentsError.message}
          />
        ) : incidentsLoading || !incidents ? (
          <TableSkeleton rows={5} />
        ) : (
          <RecentIncidentsTable incidents={incidents} limit={5} />
        )}
      </div>
    </div>
  )
}
