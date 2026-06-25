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

    it("clears key and direction when onChange receives undefined sort data", () => {
      // arrange
      const { result } = renderHook(() =>
        useSorting<string, unknown>({ defaultSortKey: "name", defaultSortDirection: "ascend" }),
      )

      // act
      act(() => {
        result.current.sortData.onChange(undefined)
      })

      // assert
      expect(result.current.sortKey).toBeUndefined()
      expect(result.current.sortDirection).toBeUndefined()
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
      expect(result.current.sortKey).toBe("name")
    })
  })
})
