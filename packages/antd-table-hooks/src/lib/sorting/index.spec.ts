import { act, renderHook } from "@testing-library/react"
import { SortOrder } from "antd/es/table/interface"
import { useSorting } from "."

describe("useSorting", () => {
  describe("standalone mode", () => {
    it("initializes with the provided default key and direction", () => {
      // arrange / act
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ defaultSortKey: "name", defaultSortDirection: "ascend" }),
      )

      // assert
      expect(result.current.sortKey).toBe("name")
      expect(result.current.sortDirection).toBe("ascend")
      expect(result.current.isDescending).toBe(false)
    })

    it("reports isDescending true when direction is descend", () => {
      // arrange / act
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ defaultSortKey: "createdAt", defaultSortDirection: "descend" }),
      )

      // assert
      expect(result.current.isDescending).toBe(true)
    })

    it("exposes sortData reflecting the current key and direction", () => {
      // arrange / act
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ defaultSortKey: "name", defaultSortDirection: "ascend" }),
      )

      // assert
      expect(result.current.sortData.data).toEqual({ order: "ascend", columnKey: "name" })
    })

    it("updates key and direction when sortData.onChange fires", () => {
      // arrange
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ defaultSortKey: "name", defaultSortDirection: "ascend" }),
      )

      // act
      act(() => {
        result.current.sortData.onChange({ columnKey: "email", order: "descend" })
      })

      // assert
      expect(result.current.sortKey).toBe("email")
      expect(result.current.sortDirection).toBe("descend")
      expect(result.current.isDescending).toBe(true)
    })

    it("falls back to the default key and direction when the sorter is cleared", () => {
      // arrange
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ defaultSortKey: "name", defaultSortDirection: "ascend" }),
      )

      // act
      act(() => {
        result.current.sortData.onChange(undefined)
      })

      // assert - clearing resolves back to the configured default, not undefined
      expect(result.current.sortKey).toBe("name")
      expect(result.current.sortDirection).toBe("ascend")
      expect(result.current.isDescending).toBe(false)
    })

    it("invokes onSortUpdate with the new key and direction", () => {
      // arrange
      const onSortUpdate = vi.fn()
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ defaultSortKey: "name", defaultSortDirection: "ascend", onSortUpdate }),
      )

      // act
      act(() => {
        result.current.sortData.onChange({ columnKey: "age", order: "descend" })
      })

      // assert
      expect(onSortUpdate).toHaveBeenCalledWith("age", "descend")
    })

    it("resyncs when default key or direction changes between renders", () => {
      // arrange
      const { result, rerender } = renderHook(props => useSorting<string, unknown>(props), {
        initialProps: { defaultSortKey: "name", defaultSortDirection: "ascend" as SortOrder },
      })

      // act
      rerender({ defaultSortKey: "createdAt", defaultSortDirection: "descend" })

      // assert
      expect(result.current.sortKey).toBe("createdAt")
      expect(result.current.sortDirection).toBe("descend")
    })

    it("keeps the user's sort when the default changes after they have sorted", () => {
      // arrange
      const { result, rerender } = renderHook(props => useSorting<string, unknown>(props), {
        initialProps: { defaultSortKey: "name", defaultSortDirection: "ascend" as SortOrder },
      })

      // act - the user picks a sort, then the caller changes the default underneath
      act(() => {
        result.current.sortData.onChange({ columnKey: "email", order: "descend" })
      })
      rerender({ defaultSortKey: "createdAt", defaultSortDirection: "ascend" })

      // assert - the explicit selection persists; a default change does not override it
      expect(result.current.sortData.data).toEqual({ columnKey: "email", order: "descend" })
    })

    it("defaults to empty state when called with an empty options object", () => {
      // arrange / act
      const { result } = renderHook(() => useSorting<string, unknown>({}))

      // assert
      expect(result.current.sortKey).toBeUndefined()
      expect(result.current.sortDirection).toBeUndefined()
      expect(result.current.isDescending).toBe(false)
    })
  })

  describe("query-state mode", () => {
    it("reads key and direction from the query-state object", () => {
      // arrange
      const onSortUpdate = vi.fn()

      // act
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ sortKey: "status", sortDirection: "descend", onSortUpdate }),
      )

      // assert
      expect(result.current.sortKey).toBe("status")
      expect(result.current.sortDirection).toBe("descend")
      expect(result.current.isDescending).toBe(true)
    })

    it("forwards updates to the query-state onSortUpdate callback", () => {
      // arrange
      const onSortUpdate = vi.fn()
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ sortKey: "status", sortDirection: "ascend", onSortUpdate }),
      )

      // act
      act(() => {
        result.current.sortData.onChange({ columnKey: "name", order: "descend" })
      })

      // assert
      expect(onSortUpdate).toHaveBeenCalledWith("name", "descend")
    })

    it("tracks the query-state props as they change", () => {
      // arrange
      const onSortUpdate = vi.fn()
      const { result, rerender } = renderHook(props => useSorting<string, unknown>(props), {
        initialProps: { sortKey: "status", sortDirection: "ascend" as SortOrder, onSortUpdate },
      })

      // act
      rerender({ sortKey: "name", sortDirection: "descend", onSortUpdate })

      // assert
      expect(result.current.sortKey).toBe("name")
      expect(result.current.sortData.data).toEqual({ columnKey: "name", order: "descend" })
    })

    it("returns to the resolved default on reset even when a dimension is unchanged", () => {
      // arrange - emulate useTable: onSortUpdate(undefined) clears the URL, so the query state
      // resolves back to the defaults. Here the default direction (descend) equals the
      // pre-reset direction, which used to leave sortDirection stuck at undefined.
      const defaultSortKey = "firstDay"
      const defaultSortDirection: SortOrder = "descend"
      const { result, rerender } = renderHook(props => useSorting<string, unknown>(props), {
        initialProps: { sortKey: "lastDay", sortDirection: "descend" as SortOrder, onSortUpdate: vi.fn() },
      })

      // act - reset the sorter, then let the query state resolve back to the defaults
      act(() => {
        result.current.sortData.onChange(undefined)
      })
      rerender({ sortKey: defaultSortKey, sortDirection: defaultSortDirection, onSortUpdate: vi.fn() })

      // assert - both dimensions reflect the resolved default, not a stale undefined
      expect(result.current.sortData.data).toEqual({ columnKey: "firstDay", order: "descend" })
    })

    it("reflects an external query-state change after the user has sorted", () => {
      // arrange
      const onSortUpdate = vi.fn()
      const { result, rerender } = renderHook(props => useSorting<string, unknown>(props), {
        initialProps: { sortKey: "firstDay", sortDirection: "descend" as SortOrder, onSortUpdate },
      })

      // act - the user sorts (a real consumer propagates it into the props), then the URL
      // changes externally (e.g. browser back) without going through onChange
      act(() => {
        result.current.sortData.onChange({ columnKey: "lastDay", order: "ascend" })
      })
      rerender({ sortKey: "lastDay", sortDirection: "ascend", onSortUpdate })
      rerender({ sortKey: "firstDay", sortDirection: "descend", onSortUpdate })

      // assert - the query-state props win; no stale local value lingers
      expect(result.current.sortData.data).toEqual({ columnKey: "firstDay", order: "descend" })
    })
  })
})
