import { renderHook } from "@testing-library/react"
import { z } from "zod"
import { buildPaginationSearchSchema, buildSortingSearchSchema, tableSearchSchema, useTable } from "."
import { FilterDefinition } from "../filters/types"

type Query = Record<string, unknown>

function nameFilter(): FilterDefinition<Query, string, "name"> {
  return {
    id: "name",
    component: () => null,
    searchSchema: [["nameParam", z.string().optional()]] as const,
    toSearchParams: value => ({ nameParam: value }),
    fromSearchParams: (params: { nameParam?: string }) => params.nameParam,
  }
}

const baseProps = {
  definedFilters: [nameFilter()] as [ReturnType<typeof nameFilter>],
  tableId: "users",
  defaultSortKey: "createdAt",
  defaultSortDirection: "descend" as const,
}

describe("buildPaginationSearchSchema", () => {
  it("prefixes keys with the table id and coerces numbers", () => {
    // arrange / act
    const schema = buildPaginationSearchSchema("users")

    // assert
    expect(schema.parse({ "users-displayPage": "3", "users-pageSize": "50" })).toEqual({
      "users-displayPage": 3,
      "users-pageSize": 50,
    })
  })

  it("treats both params as optional", () => {
    // arrange / act
    const schema = buildPaginationSearchSchema("users")

    // assert
    expect(schema.parse({})).toEqual({})
  })
})

describe("buildSortingSearchSchema", () => {
  it("coerces the sort key with the supplied schema and the descending flag to boolean", () => {
    // arrange / act
    const schema = buildSortingSearchSchema("users", z.coerce.number())

    // assert
    expect(schema.parse({ "users-sortKey": "2", "users-sortDescending": "true" })).toEqual({
      "users-sortKey": 2,
      "users-sortDescending": true,
    })
  })
})

describe("tableSearchSchema", () => {
  it("merges filter, pagination, and sorting params into one schema", () => {
    // arrange
    const filtersSchema = z.object({ nameParam: z.string().optional() })

    // act
    const schema = tableSearchSchema(filtersSchema, "users", z.coerce.number())

    // assert
    expect(Object.keys(schema.shape).toSorted()).toEqual([
      "nameParam",
      "users-displayPage",
      "users-pageSize",
      "users-sortDescending",
      "users-sortKey",
    ])
  })
})

describe("useTable", () => {
  describe("derived state", () => {
    it("falls back to defaults when query params are empty", () => {
      // arrange / act
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({ ...baseProps, queryParams: {}, setQueryParams: vi.fn() }),
      )

      // assert
      expect(result.current.filters.values).toBeUndefined()
      expect(result.current.pagination.displayPage).toBe(1)
      expect(result.current.pagination.pageSize).toBe(100)
      expect(result.current.sorting.sortKey).toBe("createdAt")
      expect(result.current.sorting.sortDirection).toBe("descend")
    })

    it("honors an overridden default page size", () => {
      // arrange / act
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          defaultPageSize: 25,
          queryParams: {},
          setQueryParams: vi.fn(),
        }),
      )

      // assert
      expect(result.current.pagination.pageSize).toBe(25)
    })

    it("reads pagination and sorting from query params", () => {
      // arrange / act
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: {
            "users-displayPage": 4,
            "users-pageSize": 20,
            "users-sortKey": "name",
            "users-sortDescending": false,
          },
          setQueryParams: vi.fn(),
        }),
      )

      // assert
      expect(result.current.pagination.displayPage).toBe(4)
      expect(result.current.pagination.pageSize).toBe(20)
      expect(result.current.sorting.sortKey).toBe("name")
      expect(result.current.sorting.sortDirection).toBe("ascend")
    })

    it("collects filter values from query params via fromSearchParams", () => {
      // arrange / act
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: { nameParam: "alice" },
          setQueryParams: vi.fn(),
        }),
      )

      // assert
      expect(result.current.filters.values).toEqual({ name: "alice" })
    })
  })

  describe("onPaginationChange", () => {
    it("omits default page and page size from the written params", () => {
      // arrange
      const setQueryParams = vi.fn()
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: { nameParam: "alice" },
          setQueryParams,
        }),
      )

      // act
      result.current.pagination.onPaginationChange({ displayPage: 1, pageSize: 100 })

      // assert: defaults dropped, unrelated params preserved
      expect(setQueryParams).toHaveBeenCalledWith({ nameParam: "alice" })
    })

    it("writes non-default page and page size while preserving other params", () => {
      // arrange
      const setQueryParams = vi.fn()
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: { nameParam: "alice" },
          setQueryParams,
        }),
      )

      // act
      result.current.pagination.onPaginationChange({ displayPage: 3, pageSize: 20 })

      // assert
      expect(setQueryParams).toHaveBeenCalledWith({
        nameParam: "alice",
        "users-displayPage": 3,
        "users-pageSize": 20,
      })
    })
  })

  describe("onSortUpdate", () => {
    it("omits sort params when the update matches the defaults", () => {
      // arrange
      const setQueryParams = vi.fn()
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: { "users-sortKey": "name", "users-sortDescending": false },
          setQueryParams,
        }),
      )

      // act
      result.current.sorting.onSortUpdate("createdAt", "descend")

      // assert: prior sort params stripped, none re-added
      expect(setQueryParams).toHaveBeenCalledWith({})
    })

    it("writes the sort key and a descending flag for non-default sorts", () => {
      // arrange
      const setQueryParams = vi.fn()
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: {},
          setQueryParams,
        }),
      )

      // act
      result.current.sorting.onSortUpdate("name", "ascend")

      // assert
      expect(setQueryParams).toHaveBeenCalledWith({
        "users-sortKey": "name",
        "users-sortDescending": false,
      })
    })

    it("drops an undefined direction from the written params", () => {
      // arrange
      const setQueryParams = vi.fn()
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: {},
          setQueryParams,
        }),
      )

      // act
      result.current.sorting.onSortUpdate("name", undefined)

      // assert: sortKey written, sortDescending omitted because direction is undefined
      expect(setQueryParams).toHaveBeenCalledWith({ "users-sortKey": "name" })
    })
  })

  describe("onFiltersChange", () => {
    it("writes cleaned filter params and resets the display page", () => {
      // arrange
      const setQueryParams = vi.fn()
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: { "users-displayPage": 5, "users-pageSize": 20 },
          setQueryParams,
        }),
      )

      // act
      result.current.filters.onFiltersChange({ name: "bob" } as never)

      // assert: pageSize preserved, displayPage cleared, filter param written
      expect(setQueryParams).toHaveBeenCalledWith({ "users-pageSize": 20, nameParam: "bob" })
    })

    it("strips empty filter values so they never reach the URL", () => {
      // arrange
      const setQueryParams = vi.fn()
      const { result } = renderHook(() =>
        useTable<Query, [ReturnType<typeof nameFilter>]>({
          ...baseProps,
          queryParams: { nameParam: "old" },
          setQueryParams,
        }),
      )

      // act
      result.current.filters.onFiltersChange({ name: "" } as never)

      // assert: empty string dropped and the stale param removed
      expect(setQueryParams).toHaveBeenCalledWith({})
    })
  })
})
