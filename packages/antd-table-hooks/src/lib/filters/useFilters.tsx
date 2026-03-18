import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Subject } from "rxjs"
import { FilterDefinition } from "./types"

export type UseFiltersProps<TQuery, TValues extends Record<string, unknown> = Record<string, unknown>> = {
  filters: FilterDefinition<TQuery, any, string>[]
  onFiltersChange?: (filters: Record<string, ((value: TQuery) => TQuery) | undefined>, values: TValues) => void
  initialValues?: Partial<TValues>
}

/**
 * Manages filter state and produces an `applyFilters` function that applies all active filters to a query object.
 * Returns filter React components and helpers for resetting filters and checking if any filter is active.
 *
 * @param props.filters - Array of filter definitions (from `defineFilters`)
 * @param props.onFiltersChange - Callback invoked when any filter value changes, receives all filter functions and current values
 * @param props.initialValues - Initial filter values (e.g. restored from URL params via `useTable().filters.values`)
 * @returns Object containing `applyFilters(query)`, `filterComponents` (React nodes), `resetFilters()`, and `anyFilterSet` boolean
 *
 * @example
 * ```typescript
 * import { useFilters } from "@leancodepl/antd-table-hooks";
 *
 * const { applyFilters, filters } = useFilters({
 *   filters: userFilters,
 *   onFiltersChange: resetPage,
 * });
 *
 * const query = applyFilters({ PageNumber: page, PageSize: pageSize });
 * ```
 */
export function useFilters<TQuery, TValues extends Record<string, unknown> = Record<string, unknown>>({
  filters,
  onFiltersChange,
  initialValues,
}: UseFiltersProps<TQuery, TValues>) {
  const [allFilters, setAllFilters] = useState<Record<string, ((value: TQuery) => TQuery) | undefined>>(() =>
    buildInitialFilters(filters, initialValues),
  )
  const allValues = useRef(initialValues ?? {})
  const [resetSubject] = useState(() => new Subject<unknown>())
  const serializedInitialValues = JSON.stringify(initialValues)

  useEffect(() => {
    setAllFilters(buildInitialFilters(filters, initialValues))
    allValues.current = initialValues ?? {}
  }, [serializedInitialValues]) // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = useCallback(
    (query: TQuery) =>
      Object.values(allFilters).reduce((query, applyFilter) => (applyFilter ? applyFilter(query) : query), query),
    [allFilters],
  )

  const filterComponents = useMemo<ReactNode[]>(
    () =>
      filters.map(({ component: Filter, id }) => {
        const applyFilter = (applyFilter: ((query: TQuery) => TQuery) | undefined, value?: unknown) => {
          allValues.current = { ...allValues.current, [id]: value }
          setAllFilters(currentFilters => {
            const newFilters = { ...currentFilters, [id]: applyFilter }
            onFiltersChange?.(newFilters, allValues.current as TValues)
            return newFilters
          })
        }

        return <Filter key={id} applyFilter={applyFilter} initialValue={initialValues?.[id]} reset$={resetSubject} />
      }),
    [filters, onFiltersChange, resetSubject, initialValues],
  )

  const resetFilters = useCallback(() => {
    resetSubject.next(undefined)
  }, [resetSubject])

  const anyFilterSet = useMemo(() => Object.values(allFilters).some(Boolean), [allFilters])

  const result = {
    filterComponents,
    applyFilters,
    resetFilters,
    anyFilterSet,
  }

  return { filters: result, ...result }
}

function buildInitialFilters<TQuery>(
  filters: FilterDefinition<TQuery, any, string>[],
  initialValues?: Record<string, unknown>,
): Record<string, ((value: TQuery) => TQuery) | undefined> {
  if (!initialValues) return {}

  return Object.fromEntries(
    filters.flatMap(f => {
      const value = initialValues[f.id]
      if (value === undefined || !f.buildApplyFilter) return []

      const applyFilter = f.buildApplyFilter(value)
      return applyFilter ? [[f.id, applyFilter]] : []
    }),
  )
}
