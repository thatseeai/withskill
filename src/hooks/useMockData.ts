import { useState, useEffect } from 'react'

export interface MockDataState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Custom hook to simulate async data loading with setTimeout
 * Mimics real API calls with loading states
 */
export function useMockData<T>(
  dataFn: () => T,
  delay: number = 500,
  shouldError: boolean = false
): MockDataState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      try {
        if (shouldError) {
          throw new Error('Failed to load data')
        }
        setData(dataFn())
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setLoading(false)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [refetchTrigger, delay, shouldError])

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1)
  }

  return { data, loading, error, refetch }
}
