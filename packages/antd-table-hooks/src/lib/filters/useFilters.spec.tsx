import { ComponentProps, useEffect } from "react"
import { act, render, renderHook } from "@testing-library/react"
import { FilterDefinition } from "./types"
import { useFilters } from "./useFilters"

type Query = { Name?: string; Min?: number }

type FilterComponentProps = ComponentProps<FilterDefinition<Query>["component"]>

// A filter component that exposes its applyFilter trigger through a shared map,
// and subscribes to reset$ so we can verify reset propagation.
type Captured = {
  trigger: (fn: ((q: Query) => Query) | undefined, value?: unknown) => void
  resetCount: number
}

class CapturedFilters {
  private readonly map = new Map<string, Captured>()

  ensure(id: string, trigger: Captured["trigger"]): Captured {
    const existing = this.map.get(id)
    if (existing) {
      existing.trigger = trigger
      return existing
    }
    const created: Captured = { trigger, resetCount: 0 }
    this.map.set(id, created)
    return created
  }

  get(id: string): Captured {
    const entry = this.map.get(id)
    if (!entry) throw new Error(`No captured filter for id "${id}"`)
    return entry
  }
}

function makeFilter(id: string, captured: CapturedFilters): FilterDefinition<Query, unknown, string> {
  function FilterComponent({ applyFilter, reset$ }: FilterComponentProps) {
    const entry = captured.ensure(id, applyFilter)

    useEffect(() => {
      const sub = reset$.subscribe(() => {
        entry.resetCount += 1
      })
      return () => sub.unsubscribe()
    }, [reset$, entry])

    return null
  }

  return {
    id,
    component: FilterComponent,
    buildApplyFilter: value => (value !== undefined ? query => ({ ...query, Name: value as string }) : undefined),
  }
}

describe("useFilters", () => {
  it("applyFilters returns the query untouched when no filters are active", () => {
    // arrange
    const captured = new CapturedFilters()
    const { result } = renderHook(() => useFilters<Query>({ filters: [makeFilter("name", captured)] }))

    // act
    const out = result.current.applyFilters({ Name: undefined })

    // assert
    expect(out).toEqual({ Name: undefined })
    expect(result.current.anyFilterSet).toBe(false)
  })

  it("renders one component per filter definition", () => {
    // arrange
    const captured = new CapturedFilters()
    const { result } = renderHook(() =>
      useFilters<Query>({ filters: [makeFilter("name", captured), makeFilter("min", captured)] }),
    )

    // assert
    expect(result.current.filterComponents).toHaveLength(2)
  })

  it("applies an active filter function to the query and flags anyFilterSet", () => {
    // arrange
    const captured = new CapturedFilters()
    const { result } = renderHook(() => useFilters<Query>({ filters: [makeFilter("name", captured)] }))
    render(<>{result.current.filterComponents}</>)

    // act
    act(() => {
      captured.get("name").trigger(q => ({ ...q, Name: "alice" }), "alice")
    })

    // assert
    expect(result.current.applyFilters({})).toEqual({ Name: "alice" })
    expect(result.current.anyFilterSet).toBe(true)
  })

  it("composes multiple active filters in sequence", () => {
    // arrange
    const captured = new CapturedFilters()
    const { result } = renderHook(() =>
      useFilters<Query>({ filters: [makeFilter("name", captured), makeFilter("min", captured)] }),
    )
    render(<>{result.current.filterComponents}</>)

    // act
    act(() => {
      captured.get("name").trigger(q => ({ ...q, Name: "bob" }), "bob")
    })
    act(() => {
      captured.get("min").trigger(q => ({ ...q, Min: 18 }), 18)
    })

    // assert
    expect(result.current.applyFilters({})).toEqual({ Name: "bob", Min: 18 })
  })

  it("clearing a filter (undefined fn) removes it from anyFilterSet", () => {
    // arrange
    const captured = new CapturedFilters()
    const { result } = renderHook(() => useFilters<Query>({ filters: [makeFilter("name", captured)] }))
    render(<>{result.current.filterComponents}</>)

    // act
    act(() => {
      captured.get("name").trigger(q => ({ ...q, Name: "x" }), "x")
    })
    expect(result.current.anyFilterSet).toBe(true)

    act(() => {
      captured.get("name").trigger(undefined, undefined)
    })

    // assert
    expect(result.current.anyFilterSet).toBe(false)
    expect(result.current.applyFilters({})).toEqual({})
  })

  it("invokes onFiltersChange with the filter map and accumulated values", () => {
    // arrange
    const captured = new CapturedFilters()
    const onFiltersChange = vi.fn()
    const { result } = renderHook(() =>
      useFilters<Query>({ filters: [makeFilter("name", captured)], onFiltersChange }),
    )
    render(<>{result.current.filterComponents}</>)

    // act
    act(() => {
      captured.get("name").trigger(q => ({ ...q, Name: "carol" }), "carol")
    })

    // assert
    expect(onFiltersChange).toHaveBeenCalledTimes(1)
    const [filterMap, values] = onFiltersChange.mock.lastCall ?? []
    expect(typeof (filterMap as Record<string, unknown>)["name"]).toBe("function")
    expect(values).toEqual({ name: "carol" })
  })

  it("notifies subscribed components when resetFilters is called", () => {
    // arrange
    const captured = new CapturedFilters()
    const { result } = renderHook(() => useFilters<Query>({ filters: [makeFilter("name", captured)] }))
    render(<>{result.current.filterComponents}</>)
    expect(captured.get("name").resetCount).toBe(0)

    // act
    act(() => {
      result.current.resetFilters()
    })

    // assert
    expect(captured.get("name").resetCount).toBe(1)
  })

  it("seeds active filters from initialValues via buildApplyFilter", () => {
    // arrange
    const captured = new CapturedFilters()

    // act
    const { result } = renderHook(() =>
      useFilters<Query>({ filters: [makeFilter("name", captured)], initialValues: { name: "seed" } as never }),
    )

    // assert
    expect(result.current.anyFilterSet).toBe(true)
    expect(result.current.applyFilters({})).toEqual({ Name: "seed" })
  })

  it("exposes filters both nested and spread on the result for ergonomic access", () => {
    // arrange
    const captured = new CapturedFilters()

    // act
    const { result } = renderHook(() => useFilters<Query>({ filters: [makeFilter("name", captured)] }))

    // assert
    expect(result.current.filters.applyFilters).toBe(result.current.applyFilters)
    expect(result.current.filters.resetFilters).toBe(result.current.resetFilters)
  })
})
