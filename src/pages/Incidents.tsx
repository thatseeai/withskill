import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mockIncidents } from '@/data/mock'
import { Incident, Severity, Status } from '@/types/incident'
import { getSeverityOrder } from '@/utils/severity'
import { useDebounce } from '@/hooks/useDebounce'
import { FilterPanel } from '@/components/incidents/FilterPanel'
import { IncidentsTable } from '@/components/incidents/IncidentsTable'
import { IncidentDrawer } from '@/components/incidents/IncidentDrawer'
import { Pagination } from '@/components/incidents/Pagination'
import { EmptyState } from '@/components/common/EmptyState'
import { Search } from 'lucide-react'

type SortColumn = 'started' | 'severity' | 'duration'
type SortDirection = 'asc' | 'desc'

export default function Incidents() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Filters
  const [filters, setFilters] = useState({
    severities: [] as Severity[],
    status: 'all',
    dateRange: '7d',
    search: '',
  })

  // Sorting
  const [sortColumn, setSortColumn] = useState<SortColumn>('started')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Drawer
  const selectedId = searchParams.get('selected')
  const [drawerOpen, setDrawerOpen] = useState(!!selectedId)

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 300)

  // Filter incidents
  const filteredIncidents = useMemo(() => {
    let result = [...mockIncidents]

    // Filter by severity
    if (filters.severities.length > 0) {
      result = result.filter((inc) => filters.severities.includes(inc.severity))
    }

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter((inc) => inc.status === filters.status)
    }

    // Filter by date range
    const now = new Date()
    const ranges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }
    const rangeMs = ranges[filters.dateRange as keyof typeof ranges]
    result = result.filter((inc) => now.getTime() - inc.started.getTime() <= rangeMs)

    // Filter by search
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      result = result.filter(
        (inc) =>
          inc.title.toLowerCase().includes(searchLower) ||
          inc.owner.toLowerCase().includes(searchLower) ||
          inc.id.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [filters.severities, filters.status, filters.dateRange, debouncedSearch])

  // Sort incidents
  const sortedIncidents = useMemo(() => {
    const result = [...filteredIncidents]

    result.sort((a, b) => {
      let comparison = 0

      switch (sortColumn) {
        case 'started':
          comparison = a.started.getTime() - b.started.getTime()
          break
        case 'severity':
          comparison = getSeverityOrder(a.severity) - getSeverityOrder(b.severity)
          break
        case 'duration':
          comparison = a.duration - b.duration
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [filteredIncidents, sortColumn, sortDirection])

  // Paginate incidents
  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedIncidents.slice(start, end)
  }, [sortedIncidents, currentPage])

  const totalPages = Math.ceil(sortedIncidents.length / itemsPerPage)

  // Count active filters
  const activeFilterCount =
    filters.severities.length +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.search ? 1 : 0)

  // Handlers
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const handleRowClick = (incident: Incident) => {
    setSearchParams({ selected: incident.id })
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSearchParams({})
  }

  const selectedIncident = selectedId
    ? mockIncidents.find((inc) => inc.id === selectedId) || null
    : null

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [filters])

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track active and resolved incidents
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Table */}
        <div className="lg:col-span-3 space-y-4">
          {sortedIncidents.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No incidents found"
              description="Try adjusting your filters to see more results"
              action={{
                label: 'Reset Filters',
                onClick: () =>
                  setFilters({
                    severities: [],
                    status: 'all',
                    dateRange: '7d',
                    search: '',
                  }),
              }}
            />
          ) : (
            <>
              <IncidentsTable
                incidents={paginatedIncidents}
                selectedId={selectedId}
                onRowClick={handleRowClick}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={sortedIncidents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {/* Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}
