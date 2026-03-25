import { useCallback, useState } from "react"
import { TablePaginationConfig } from "antd/lib"
import { useSyncState } from "@leancodepl/utils"

type UsePaginationProps = {
  initialDisplayPage?: number
  initialPageSize?: number
  onPaginationChange?: (props: { displayPage: number; pageSize: number }) => void
}

type QueryStatePagination = {
  displayPage: number
  pageSize: number
  onPaginationChange: (props: { displayPage: number; pageSize: number }) => void
}

/**
 * Manages table pagination state with zero-indexed page output for API calls. Supports two modes:
 * URL-driven (via `useTable().pagination`) or standalone with local state. Returns a
 * `getTablePagination` helper that produces an Ant Design `TablePaginationConfig`.
 *
 * @param props - Either a `QueryStatePagination` object from `useTable().pagination`, or an optional object with `initialDisplayPage`, `initialPageSize`, and `onPaginationChange` callback
 * @returns Object containing zero-indexed `page`, `pageSize`, `getTablePagination(total)` function, and `resetPage` function
 *
 * @example
 * ```typescript
 * import { usePagination } from "@leancodepl/antd-table-hooks";
 *
 * // With URL state (via useTable)
 * const { page, pageSize, getTablePagination, resetPage } = usePagination(queryState.pagination);
 *
 * // Standalone
 * const { page, pageSize, getTablePagination, resetPage } = usePagination();
 *
 * // Pass to Ant Design table
 * <Table pagination={getTablePagination(data?.totalCount)} />
 * ```
 */
export function usePagination(queryStatePagination: QueryStatePagination): {
  page: number
  pageSize: number
  getTablePagination: (total?: number) => TablePaginationConfig
  resetPage: () => void
}
export function usePagination(props?: UsePaginationProps): {
  page: number
  pageSize: number
  getTablePagination: (total?: number) => TablePaginationConfig
  resetPage: () => void
}
export function usePagination(props: QueryStatePagination | UsePaginationProps = {}) {
  const { initialDisplayPage, initialPageSize, onPaginationChange } = normalizePaginationProps(props)

  const [displayPage, setDisplayPage] = useState(initialDisplayPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  useSyncState(initialDisplayPage, () => {
    setDisplayPage(initialDisplayPage)
  })

  useSyncState(initialPageSize, () => {
    setPageSize(initialPageSize)
  })

  const getTablePagination = useCallback(
    (total?: number): TablePaginationConfig => ({
      current: displayPage,
      pageSize: pageSize,
      total: total,
      showSizeChanger: true,
      pageSizeOptions: defaultPageSizeOptions,
      onChange: (newCurrentPage, newPageSize) => {
        setDisplayPage(newCurrentPage)
        setPageSize(newPageSize)
        onPaginationChange?.({ displayPage: newCurrentPage, pageSize: newPageSize })
      },
    }),
    [displayPage, pageSize, onPaginationChange],
  )

  const resetPage = useCallback(() => {
    setDisplayPage(defaultDisplayPage)
  }, [])

  return {
    page: displayPage - 1,
    pageSize,
    getTablePagination,
    resetPage,
  }
}

function normalizePaginationProps(props: QueryStatePagination | UsePaginationProps): Required<UsePaginationProps> {
  if (
    "displayPage" in props &&
    "pageSize" in props &&
    "onPaginationChange" in props &&
    !("initialDisplayPage" in props)
  ) {
    return {
      initialDisplayPage: props.displayPage,
      initialPageSize: props.pageSize,
      onPaginationChange: props.onPaginationChange,
    }
  }

  return {
    initialDisplayPage: (props as UsePaginationProps).initialDisplayPage ?? defaultDisplayPage,
    initialPageSize: (props as UsePaginationProps).initialPageSize ?? defaultPageSize,
    onPaginationChange: (props as UsePaginationProps).onPaginationChange ?? (() => {}),
  }
}

const defaultDisplayPage = 1
const defaultPageSizeOptions = [10, 20, 50, 100]
const defaultPageSize = 100
