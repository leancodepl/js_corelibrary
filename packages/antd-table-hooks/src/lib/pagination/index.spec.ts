import { act, renderHook } from "@testing-library/react"
import { usePagination } from "."

describe("usePagination", () => {
  describe("standalone mode", () => {
    it("uses default page (1, zero-indexed 0) and page size (100) when no props are given", () => {
      // arrange / act
      const { result } = renderHook(() => usePagination())

      // assert
      expect(result.current.page).toBe(0)
      expect(result.current.pageSize).toBe(100)
    })

    it("honors initial display page and page size", () => {
      // arrange / act
      const { result } = renderHook(() => usePagination({ initialDisplayPage: 3, initialPageSize: 25 }))

      // assert
      expect(result.current.page).toBe(2)
      expect(result.current.pageSize).toBe(25)
    })

    it("resyncs local state when initial values change between renders", () => {
      // arrange
      const { result, rerender } = renderHook(props => usePagination(props), {
        initialProps: { initialDisplayPage: 1, initialPageSize: 100 },
      })

      // act
      rerender({ initialDisplayPage: 5, initialPageSize: 20 })

      // assert
      expect(result.current.page).toBe(4)
      expect(result.current.pageSize).toBe(20)
    })
  })

  describe("getTablePagination", () => {
    it("produces an antd pagination config carrying the supplied total", () => {
      // arrange
      const { result } = renderHook(() => usePagination({ initialDisplayPage: 2, initialPageSize: 50 }))

      // act
      const config = result.current.getTablePagination(123)

      // assert
      expect(config.current).toBe(2)
      expect(config.pageSize).toBe(50)
      expect(config.total).toBe(123)
      expect(config.showSizeChanger).toBe(true)
      expect(config.pageSizeOptions).toEqual([10, 20, 50, 100])
    })

    it("leaves total undefined when none is supplied", () => {
      // arrange
      const { result } = renderHook(() => usePagination())

      // act
      const config = result.current.getTablePagination()

      // assert
      expect(config.total).toBeUndefined()
    })

    it("updates internal state and reflects the zero-indexed page after onChange", () => {
      // arrange
      const { result } = renderHook(() => usePagination())

      // act
      act(() => {
        result.current.getTablePagination().onChange?.(4, 20)
      })

      // assert
      expect(result.current.page).toBe(3)
      expect(result.current.pageSize).toBe(20)
    })

    it("invokes the onPaginationChange callback with the one-indexed display page", () => {
      // arrange
      const onPaginationChange = vi.fn()
      const { result } = renderHook(() => usePagination({ onPaginationChange }))

      // act
      act(() => {
        result.current.getTablePagination().onChange?.(7, 50)
      })

      // assert
      expect(onPaginationChange).toHaveBeenCalledWith({ displayPage: 7, pageSize: 50 })
    })
  })

  describe("resetPage", () => {
    it("returns the page to the first page", () => {
      // arrange
      const { result } = renderHook(() => usePagination({ initialDisplayPage: 9 }))
      expect(result.current.page).toBe(8)

      // act
      act(() => {
        result.current.resetPage()
      })

      // assert
      expect(result.current.page).toBe(0)
    })
  })

  describe("query-state mode", () => {
    it("reads display page and page size from the query-state object", () => {
      // arrange
      const onPaginationChange = vi.fn()

      // act
      const { result } = renderHook(() =>
        usePagination({ displayPage: 4, pageSize: 10, onPaginationChange }),
      )

      // assert
      expect(result.current.page).toBe(3)
      expect(result.current.pageSize).toBe(10)
    })

    it("forwards changes to the query-state onPaginationChange callback", () => {
      // arrange
      const onPaginationChange = vi.fn()
      const { result } = renderHook(() =>
        usePagination({ displayPage: 1, pageSize: 100, onPaginationChange }),
      )

      // act
      act(() => {
        result.current.getTablePagination().onChange?.(2, 50)
      })

      // assert
      expect(onPaginationChange).toHaveBeenCalledWith({ displayPage: 2, pageSize: 50 })
      expect(result.current.page).toBe(1)
    })
  })
})
