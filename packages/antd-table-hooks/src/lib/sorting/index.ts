import { Key, useMemo, useState } from "react"
import { SortOrder } from "antd/es/table/interface"
import { useSyncState } from "@leancodepl/utils"
import { SortData } from "../types"

type QueryStateSorting<TKey extends Key> = {
  sortKey: TKey
  sortDirection: SortOrder
  onSortUpdate: (sortKey?: TKey, sortDirection?: SortOrder) => void
}

/**
 * Manages table column sorting state. Supports two modes: URL-driven (via `useTable().sorting`)
 * or standalone with local state.
 *
 * @param props - Either a `QueryStateSorting` object from `useTable().sorting`, or an object with `defaultSortKey`, `defaultSortDirection`, and optional `onSortUpdate` callback
 * @returns Object containing `sortData` (pass to Ant Design table's `sort` prop), current `sortKey`, `sortDirection`, and `isDescending` boolean
 *
 * @example
 * ```typescript
 * import { useSorting } from "@leancodepl/antd-table-hooks";
 *
 * // With URL state (via useTable)
 * const { sortData, sortKey, isDescending } = useSorting(queryState.sorting);
 *
 * // Standalone
 * const { sortData, sortKey, isDescending } = useSorting({
 *   defaultSortKey: SortKey.Name,
 *   defaultSortDirection: "ascend",
 * });
 * ```
 */
export function useSorting<TKey extends Key, TData>(
  queryStateSorting: QueryStateSorting<TKey>,
): { sortData: SortData<TData>; sortKey: TKey; sortDirection: SortOrder; isDescending: boolean }
export function useSorting<TKey extends Key, TData>(props: {
  defaultSortKey: TKey
  defaultSortDirection: SortOrder
  onSortUpdate?: (sortKey?: TKey, sortDirection?: SortOrder) => void
}): { sortData: SortData<TData>; sortKey: TKey; sortDirection: SortOrder; isDescending: boolean }
export function useSorting<TKey extends Key, TData>(props: {
  defaultSortKey: TKey
  defaultSortDirection?: SortOrder
  onSortUpdate?: (sortKey?: TKey, sortDirection?: SortOrder) => void
}): { sortData: SortData<TData>; sortKey: TKey; sortDirection?: SortOrder; isDescending: boolean }
export function useSorting<TKey extends Key, TData>(props: {
  defaultSortKey?: TKey
  defaultSortDirection: SortOrder
  onSortUpdate?: (sortKey?: TKey, sortDirection?: SortOrder) => void
}): { sortData: SortData<TData>; sortKey?: TKey; sortDirection: SortOrder; isDescending: boolean }
export function useSorting<TKey extends Key, TData>(props: {
  defaultSortKey?: TKey
  defaultSortDirection?: SortOrder
  onSortUpdate?: (sortKey?: TKey, sortDirection?: SortOrder) => void
}): { sortData: SortData<TData>; sortKey?: TKey; sortDirection?: SortOrder; isDescending: boolean }
export function useSorting<TKey extends Key, TData>(
  props:
    | QueryStateSorting<TKey>
    | {
        defaultSortKey?: TKey
        defaultSortDirection?: SortOrder
        onSortUpdate?: (sortKey?: TKey, sortDirection?: SortOrder) => void
      } = {},
): {
  sortData: SortData<TData>
  sortKey?: TKey
  sortDirection?: SortOrder
  isDescending: boolean
} {
  const { defaultSortKey, defaultSortDirection, onSortUpdate } = normalizeSortingProps(props)

  const [sortKey, setSortKey] = useState(defaultSortKey)
  const [sortDirection, setSortDirection] = useState(defaultSortDirection)

  useSyncState(defaultSortKey, () => {
    setSortKey(defaultSortKey)
  })

  useSyncState(defaultSortDirection, () => {
    setSortDirection(defaultSortDirection)
  })

  const sortData = useMemo<SortData<TData>>(
    () => ({
      onChange: sortData => {
        setSortKey(sortData?.columnKey as TKey | undefined)
        setSortDirection(sortData?.order)
        onSortUpdate?.(sortData?.columnKey as TKey | undefined, sortData?.order)
      },
      data: {
        order: sortDirection,
        columnKey: sortKey,
      },
    }),
    [onSortUpdate, sortDirection, sortKey],
  )

  return {
    sortData,
    sortKey,
    sortDirection,
    isDescending: sortDirection === "descend",
  }
}

function normalizeSortingProps<TKey extends Key>(
  props:
    | QueryStateSorting<TKey>
    | {
        defaultSortKey?: TKey
        defaultSortDirection?: SortOrder
        onSortUpdate?: (sortKey?: TKey, sortDirection?: SortOrder) => void
      },
): {
  defaultSortKey?: TKey
  defaultSortDirection?: SortOrder
  onSortUpdate?: (sortKey?: TKey, sortDirection?: SortOrder) => void
} {
  if ("sortKey" in props && "sortDirection" in props && "onSortUpdate" in props) {
    return {
      defaultSortKey: props.sortKey,
      defaultSortDirection: props.sortDirection,
      onSortUpdate: props.onSortUpdate,
    }
  }

  return props
}
