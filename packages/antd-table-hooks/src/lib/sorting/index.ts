import { Key, useMemo, useState } from "react"
import { SortOrder } from "antd/es/table/interface"
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
  const isControlled = isQueryStateSorting(props)
  const onSortUpdate = props.onSortUpdate

  const [localSortKey, setLocalSortKey] = useState<TKey>()
  const [localSortDirection, setLocalSortDirection] = useState<SortOrder>()

  // Query-state mode is controlled: the caller (e.g. `useTable`) owns the value via the URL, so
  // read it directly — an external URL change (e.g. browser back) must win over a stale local
  // pick. Standalone mode is uncontrolled: the local pick is the source of truth and persists,
  // falling back to the configured default until the user sorts.
  const sortKey = isControlled ? props.sortKey : (localSortKey ?? props.defaultSortKey)
  const sortDirection = isControlled ? props.sortDirection : (localSortDirection ?? props.defaultSortDirection)

  const sortData = useMemo<SortData<TData>>(
    () => ({
      onChange: sortData => {
        if (!isControlled) {
          setLocalSortKey(sortData?.columnKey as TKey | undefined)
          setLocalSortDirection(sortData?.order)
        }
        onSortUpdate?.(sortData?.columnKey as TKey | undefined, sortData?.order)
      },
      data: {
        order: sortDirection,
        columnKey: sortKey,
      },
    }),
    [isControlled, onSortUpdate, sortDirection, sortKey],
  )

  return {
    sortData,
    sortKey,
    sortDirection,
    isDescending: sortDirection === "descend",
  }
}

function isQueryStateSorting<TKey extends Key>(
  props:
    | QueryStateSorting<TKey>
    | {
        defaultSortKey?: TKey
        defaultSortDirection?: SortOrder
        onSortUpdate?: (sortKey?: TKey, sortDirection?: SortOrder) => void
      },
): props is QueryStateSorting<TKey> {
  return "sortKey" in props && "sortDirection" in props && "onSortUpdate" in props
}
