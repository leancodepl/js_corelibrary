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
  const isQueryState = isQueryStateSorting(props)
  const { defaultSortKey, defaultSortDirection, onSortUpdate } = normalizeSortingProps(props)

  const [localSortKey, setLocalSortKey] = useState(defaultSortKey)
  const [localSortDirection, setLocalSortDirection] = useState(defaultSortDirection)

  useSyncState(defaultSortKey, () => {
    setLocalSortKey(defaultSortKey)
  })

  useSyncState(defaultSortDirection, () => {
    setLocalSortDirection(defaultSortDirection)
  })

  // In query-state mode the caller (e.g. `useTable`) owns the source of truth, so read it
  // directly instead of mirroring it into local state. A local mirror diverges on reset: Ant
  // Design fires `onChange` with `order: undefined`, but the query state resolves back to its
  // configured defaults — and the change-gated resync misses any dimension whose resolved
  // default equals its pre-reset value, leaving that dimension stuck at `undefined`.
  const sortKey = isQueryState ? defaultSortKey : localSortKey
  const sortDirection = isQueryState ? defaultSortDirection : localSortDirection

  const sortData = useMemo<SortData<TData>>(
    () => ({
      onChange: sortData => {
        if (!isQueryState) {
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
    [isQueryState, onSortUpdate, sortDirection, sortKey],
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
  if (isQueryStateSorting(props)) {
    return {
      defaultSortKey: props.sortKey,
      defaultSortDirection: props.sortDirection,
      onSortUpdate: props.onSortUpdate,
    }
  }

  return props
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
