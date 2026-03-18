import { Key, useCallback, useMemo } from "react"
import { SortOrder } from "antd/es/table/interface"
import z from "zod"
import { DefinedSearchSchema, FilterDefinition, InferFiltersSchema } from "../filters/types"

type UseQueryStateProps<
  TQueryParams extends Record<string, unknown>,
  TDefined extends FilterDefinition<any, any, string>[],
  TSortKey extends Key,
> = {
  queryParams: TQueryParams
  setQueryParams: (params: TQueryParams) => void
  definedFilters: TDefined
  tableId: string
  defaultSortKey: TSortKey
  defaultSortDirection: SortOrder
  defaultPageSize?: number
}

/**
 * Orchestrates table sorting, pagination, and filter state through URL query parameters.
 * Reads current state from `queryParams` and writes updates via `setQueryParams`, enabling
 * shareable links, browser navigation, and state restoration on page reload.
 *
 * @param props.queryParams - Current URL search params object (e.g. from TanStack Router's `useSearch`)
 * @param props.setQueryParams - Callback to update URL search params (e.g. via `navigate({ search })`)
 * @param props.definedFilters - Filter definitions created by `defineFilters`
 * @param props.tableId - Unique prefix for URL params to avoid collisions between tables on the same route
 * @param props.defaultSortKey - Initial sort column key
 * @param props.defaultSortDirection - Initial sort direction (`"ascend"` or `"descend"`)
 * @param props.defaultPageSize - Initial page size (defaults to 100)
 * @returns Object with `filters`, `pagination`, and `sorting` state to pass to `useFilters`, `usePagination`, and `useSorting`
 *
 * @example
 * ```typescript
 * import { useTable, useSorting, usePagination, useFilters } from "@leancodepl/antd-table-hooks";
 *
 * const queryState = useTable({
 *   queryParams: search,
 *   setQueryParams: params => navigate({ search: params }),
 *   definedFilters: userFilters,
 *   tableId: "users",
 *   defaultSortKey: SortKey.CreatedAt,
 *   defaultSortDirection: "descend",
 * });
 *
 * const { sortData, sortKey, isDescending } = useSorting(queryState.sorting);
 * const { page, pageSize, getTablePagination, resetPage } = usePagination(queryState.pagination);
 * ```
 */
export function useTable<
  TQueryParams extends Record<string, unknown>,
  TFilters extends FilterDefinition<any, any, string>[],
  TSortKey extends Key = Key,
>({
  queryParams,
  setQueryParams,
  definedFilters,
  tableId,
  defaultSortKey,
  defaultSortDirection,
  defaultPageSize = defaultPageSizeValue,
}: UseQueryStateProps<TQueryParams, TFilters, TSortKey>) {
  const displayPageKey = `${tableId}-displayPage`
  const pageSizeKey = `${tableId}-pageSize`
  const sortKeyKey = `${tableId}-sortKey`
  const sortDescendingKey = `${tableId}-sortDescending`

  const filterValues = useMemo(() => {
    const result: Record<string, unknown> = {}

    for (const filter of definedFilters) {
      if (!filter.fromSearchParams) continue

      const value = filter.fromSearchParams(queryParams)

      if (value !== undefined) {
        result[filter.id] = value
      }
    }

    return Object.keys(result).length > 0 ? (result as Partial<InferFiltersSchema<TFilters>>) : undefined
  }, [definedFilters, queryParams])

  const currentPagination = useMemo(
    () => ({
      displayPage: (queryParams[displayPageKey] as number | undefined) ?? defaultDisplayPage,
      pageSize: (queryParams[pageSizeKey] as number | undefined) ?? defaultPageSize,
    }),
    [displayPageKey, pageSizeKey, defaultPageSize, queryParams],
  )

  const currentSorting = useMemo(() => {
    const urlSortKey = queryParams[sortKeyKey] as TSortKey | undefined
    const urlSortDescending = queryParams[sortDescendingKey] as boolean | undefined

    return {
      sortKey: urlSortKey ?? defaultSortKey,
      sortDirection: (urlSortDescending !== undefined
        ? urlSortDescending
          ? "descend"
          : "ascend"
        : defaultSortDirection) as SortOrder,
    }
  }, [sortKeyKey, sortDescendingKey, defaultSortKey, defaultSortDirection, queryParams])

  const onFiltersChange = useCallback(
    (values: Partial<InferFiltersSchema<TFilters>> | undefined) => {
      const filterOwnedKeys = new Set(
        definedFilters.flatMap(({ searchSchema }) => searchSchema?.map(([key]) => key) ?? []),
      )

      const keysToRemove = new Set([...filterOwnedKeys, displayPageKey])
      const preservedParams = Object.fromEntries(Object.entries(queryParams).filter(([key]) => !keysToRemove.has(key)))

      const searchParams: Record<string, unknown> = {}

      for (const filter of definedFilters) {
        if (!filter.toSearchParams) continue

        const entries = filter.toSearchParams((values as Record<string, unknown>)?.[filter.id])
        Object.assign(searchParams, entries)
      }

      const cleanedSearchParams = Object.fromEntries(
        Object.entries(searchParams)
          .filter(([_, value]) => value !== undefined && value !== null && value !== "")
          .filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : true)),
      )

      setQueryParams({
        ...preservedParams,
        ...cleanedSearchParams,
      } as TQueryParams)
    },
    [definedFilters, queryParams, setQueryParams, displayPageKey],
  )

  const onPaginationChange = useCallback(
    ({ displayPage, pageSize }: { displayPage: number; pageSize: number }) => {
      const paginationKeys = new Set([displayPageKey, pageSizeKey])
      const nonPaginationParams = Object.fromEntries(
        Object.entries(queryParams).filter(([key]) => !paginationKeys.has(key)),
      )

      const paginationParams = Object.fromEntries(
        Object.entries({
          [displayPageKey]: displayPage === defaultDisplayPage ? undefined : displayPage,
          [pageSizeKey]: pageSize === defaultPageSizeValue ? undefined : pageSize,
        }).filter(([_, value]) => value !== undefined),
      )

      setQueryParams({
        ...nonPaginationParams,
        ...paginationParams,
      } as TQueryParams)
    },
    [displayPageKey, pageSizeKey, queryParams, setQueryParams],
  )

  const onSortUpdate = useCallback(
    (sortKey?: TSortKey, sortDirection?: SortOrder) => {
      const sortingKeys = new Set([sortKeyKey, sortDescendingKey])
      const nonSortingParams = Object.fromEntries(Object.entries(queryParams).filter(([key]) => !sortingKeys.has(key)))

      const isDefault = sortKey === defaultSortKey && sortDirection === defaultSortDirection

      const sortDescendingValue = sortDirection === "descend" ? true : sortDirection === "ascend" ? false : undefined

      const sortingParams = Object.fromEntries(
        Object.entries({
          [sortKeyKey]: isDefault ? undefined : sortKey,
          [sortDescendingKey]: isDefault ? undefined : sortDescendingValue,
        }).filter(([_, value]) => value !== undefined),
      )

      setQueryParams({
        ...nonSortingParams,
        ...sortingParams,
      } as TQueryParams)
    },
    [sortKeyKey, sortDescendingKey, defaultSortKey, defaultSortDirection, queryParams, setQueryParams],
  )

  return {
    filters: {
      values: filterValues,
      onFiltersChange,
    },
    pagination: {
      ...currentPagination,
      onPaginationChange,
    },
    sorting: {
      ...currentSorting,
      onSortUpdate,
    },
  }
}

/**
 * Creates a Zod schema for pagination URL parameters (`{tableId}-displayPage`, `{tableId}-pageSize`).
 *
 * @param tableId - Unique table identifier used to prefix parameter names
 * @returns Zod object schema for pagination params
 *
 * @example
 * ```typescript
 * import { buildPaginationSearchSchema } from "@leancodepl/antd-table-hooks";
 *
 * const paginationSchema = buildPaginationSearchSchema("users");
 * ```
 */
export function buildPaginationSearchSchema<TTableId extends string>(tableId: TTableId) {
  const numberSchema = z.coerce.number().optional()

  return z.object({
    [`${tableId}-displayPage`]: numberSchema,
    [`${tableId}-pageSize`]: numberSchema,
  } as Record<`${TTableId}-displayPage` | `${TTableId}-pageSize`, typeof numberSchema>)
}

/**
 * Creates a Zod schema for sorting URL parameters (`{tableId}-sortKey`, `{tableId}-sortDescending`).
 *
 * @param tableId - Unique table identifier used to prefix parameter names
 * @param sortKeySchema - Zod schema for the sort key type (e.g. `z.coerce.number()` for numeric enums)
 * @returns Zod object schema for sorting params
 *
 * @example
 * ```typescript
 * import { buildSortingSearchSchema } from "@leancodepl/antd-table-hooks";
 * import z from "zod";
 *
 * const sortingSchema = buildSortingSearchSchema("users", z.coerce.number());
 * ```
 */
export function buildSortingSearchSchema<TTableId extends string, TSortKey extends z.ZodType>(
  tableId: TTableId,
  sortKeySchema: TSortKey,
) {
  const sortKey = sortKeySchema.optional()
  const sortDescending = z.coerce.boolean().optional()

  return z.object({
    [`${tableId}-sortKey`]: sortKey,
    [`${tableId}-sortDescending`]: sortDescending,
  } as Record<`${TTableId}-sortDescending`, typeof sortDescending> & Record<`${TTableId}-sortKey`, typeof sortKey>)
}

const defaultDisplayPage = 1
const defaultPageSizeValue = 100

/**
 * Combines filter, pagination, and sorting schemas into a single Zod schema for route validation.
 * Use the result as the `validateSearch` option in TanStack Router route definitions.
 *
 * @param filtersSearchSchema - Search schema returned by `defineFilters`
 * @param tableId - Unique table identifier used to prefix parameter names
 * @param sortKeySchema - Zod schema for the sort key type (e.g. `z.coerce.number()` for numeric enums)
 * @returns Combined Zod object schema covering all table URL parameters
 *
 * @example
 * ```typescript
 * import { tableSearchSchema } from "@leancodepl/antd-table-hooks";
 * import z from "zod";
 *
 * const searchSchema = tableSearchSchema(filtersSearchSchema, "users", z.coerce.number());
 * ```
 */
export const tableSearchSchema = <
  TTableId extends string,
  TFilters extends FilterDefinition<any, any, string>[],
  TSortKey extends z.ZodType,
>(
  filtersSearchSchema: DefinedSearchSchema<TFilters>,
  tableId: TTableId,
  sortKeySchema: TSortKey,
) =>
  z.object({
    ...filtersSearchSchema.shape,
    ...buildPaginationSearchSchema(tableId).shape,
    ...buildSortingSearchSchema(tableId, sortKeySchema).shape,
  })
