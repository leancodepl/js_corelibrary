# @leancodepl/antd-table-hooks

React hooks for managing Ant Design table state — sorting, pagination, and filters — with optional URL query parameter
persistence via Zod schemas.

## Installation

```bash
npm install @leancodepl/antd-table-hooks
```

```bash
yarn add @leancodepl/antd-table-hooks
```

## API

### `useTable(props)`

Orchestrates table sorting, pagination, and filter state through URL query parameters. Reads current state from
`queryParams` and writes updates via `setQueryParams`, enabling shareable links, browser navigation, and state
restoration on page reload.

**Parameters:**

| Name                         | Type                                        | Description                                                                       |
| ---------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| `props.queryParams`          | `Record<string, unknown>`                   | Current URL search params object (e.g. from TanStack Router's `useSearch`)        |
| `props.setQueryParams`       | `(params: Record<string, unknown>) => void` | Callback to update URL search params                                              |
| `props.definedFilters`       | `FilterDefinition[]`                        | Filter definitions created by `defineFilters`                                     |
| `props.tableId`              | `string`                                    | Unique prefix for URL params to avoid collisions between tables on the same route |
| `props.defaultSortKey`       | `Key`                                       | Initial sort column key                                                           |
| `props.defaultSortDirection` | `SortOrder`                                 | Initial sort direction (`"ascend"` or `"descend"`)                                |
| `props.defaultPageSize`      | `number` (optional)                         | Initial page size (defaults to `100`)                                             |

**Returns:** `{ filters, pagination, sorting }` — state objects to pass to `useFilters`, `usePagination`, and
`useSorting`.

### `useSorting(props)`

Manages table column sorting state. Supports two modes: URL-driven (via `useTable().sorting`) or standalone with local
state.

**Parameters (URL-driven mode):**

| Name                  | Type                                                 | Description                |
| --------------------- | ---------------------------------------------------- | -------------------------- |
| `props.sortKey`       | `Key`                                                | Current sort column key    |
| `props.sortDirection` | `SortOrder`                                          | Current sort direction     |
| `props.onSortUpdate`  | `(sortKey?: Key, sortDirection?: SortOrder) => void` | Callback when sort changes |

**Parameters (standalone mode):**

| Name                         | Type                                                            | Description                |
| ---------------------------- | --------------------------------------------------------------- | -------------------------- |
| `props.defaultSortKey`       | `Key` (optional)                                                | Initial sort column key    |
| `props.defaultSortDirection` | `SortOrder` (optional)                                          | Initial sort direction     |
| `props.onSortUpdate`         | `(sortKey?: Key, sortDirection?: SortOrder) => void` (optional) | Callback when sort changes |

**Returns:** `{ sortData, sortKey, sortDirection, isDescending }`

- `sortData` — pass to an Ant Design table's `sort` prop
- `sortKey` — current sort column key
- `sortDirection` — current sort direction (`"ascend"` | `"descend"`)
- `isDescending` — `true` when `sortDirection` is `"descend"`

### `usePagination(props)`

Manages table pagination state with zero-indexed page output for API calls. Returns a `getTablePagination` helper that
produces an Ant Design `TablePaginationConfig`.

**Parameters (URL-driven mode):**

| Name                       | Type                                                         | Description                      |
| -------------------------- | ------------------------------------------------------------ | -------------------------------- |
| `props.displayPage`        | `number`                                                     | Current display page (1-indexed) |
| `props.pageSize`           | `number`                                                     | Current page size                |
| `props.onPaginationChange` | `(props: { displayPage: number; pageSize: number }) => void` | Callback when pagination changes |

**Parameters (standalone mode, all optional):**

| Name                       | Type                                                                    | Description                            |
| -------------------------- | ----------------------------------------------------------------------- | -------------------------------------- |
| `props.initialDisplayPage` | `number` (optional)                                                     | Initial display page (defaults to `1`) |
| `props.initialPageSize`    | `number` (optional)                                                     | Initial page size (defaults to `100`)  |
| `props.onPaginationChange` | `(props: { displayPage: number; pageSize: number }) => void` (optional) | Callback when pagination changes       |

**Returns:** `{ page, pageSize, getTablePagination, resetPage }`

- `page` — zero-indexed page number for API calls
- `pageSize` — current page size
- `getTablePagination(total?)` — returns an Ant Design `TablePaginationConfig`
- `resetPage()` — resets to page 1

### `defineFilters()`

Creates a typed filter definition factory along with a combined Zod search schema for URL param validation. Call with a
query type generic, then pass an array of filter definitions (or a factory function for context-dependent filters).

**Returns:** A function that accepts filter definitions and returns `{ searchSchema, filters }`.

- `searchSchema` — Zod schema for filter-related URL params, used with `tableSearchSchema`
- `filters` — the filter definitions array (or factory function) to pass to `useFilters`

### `useFilters(props)`

Manages filter state and produces an `applyFilters` function that applies all active filters to a query object.

**Parameters:**

| Name                    | Type                                   | Description                                                   |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------- |
| `props.filters`         | `FilterDefinition[]`                   | Array of filter definitions (from `defineFilters`)            |
| `props.onFiltersChange` | `(filters, values) => void` (optional) | Callback invoked when any filter value changes                |
| `props.initialValues`   | `Partial<TValues>` (optional)          | Initial filter values (e.g. from `useTable().filters.values`) |

**Returns:** `{ filters, applyFilters, filterComponents, resetFilters, anyFilterSet }`

- `filters` — convenience wrapper object containing `applyFilters`, `filterComponents`, `resetFilters`, and `anyFilterSet`
- `applyFilters(query)` — applies all active filter transforms to the query object
- `filterComponents` — array of React nodes to render filter UI
- `resetFilters()` — clears all filters
- `anyFilterSet` — `true` when at least one filter is active

### `tableSearchSchema(filtersSearchSchema, tableId, sortKeySchema)`

Combines filter, pagination, and sorting schemas into a single Zod schema for route validation.

**Parameters:**

| Name                  | Type                  | Description                                                 |
| --------------------- | --------------------- | ----------------------------------------------------------- |
| `filtersSearchSchema` | `DefinedSearchSchema` | Search schema returned by `defineFilters`                   |
| `tableId`             | `string`              | Unique table identifier used to prefix parameter names      |
| `sortKeySchema`       | `ZodType`             | Zod schema for the sort key type (e.g. `z.coerce.number()`) |

**Returns:** Combined Zod object schema covering all table URL parameters.

### `buildPaginationSearchSchema(tableId)`

Creates a Zod schema for pagination URL parameters (`{tableId}-displayPage`, `{tableId}-pageSize`).

**Parameters:**

| Name      | Type     | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `tableId` | `string` | Unique table identifier used to prefix parameter names |

**Returns:** Zod object schema for pagination params.

### `buildSortingSearchSchema(tableId, sortKeySchema)`

Creates a Zod schema for sorting URL parameters (`{tableId}-sortKey`, `{tableId}-sortDescending`).

**Parameters:**

| Name            | Type      | Description                                                 |
| --------------- | --------- | ----------------------------------------------------------- |
| `tableId`       | `string`  | Unique table identifier used to prefix parameter names      |
| `sortKeySchema` | `ZodType` | Zod schema for the sort key type (e.g. `z.coerce.number()`) |

**Returns:** Zod object schema for sorting params.

## Usage Examples

### Full Table with URL Query State

The primary pattern — persists sorting, pagination, and filters in URL search params for shareable links and state
restoration:

```tsx
import { useSearch, useNavigate } from "@tanstack/react-router"
import { keepPreviousData } from "@tanstack/react-query"
import {
  useTable,
  useSorting,
  usePagination,
  useFilters,
  defineFilters,
  tableSearchSchema,
  InferFiltersSchema,
} from "@leancodepl/antd-table-hooks"
import z from "zod"

const tableId = "reviews"

const { searchSchema: filtersSearchSchema, filters: reviewFilters } = defineFilters<SearchQuery>()([
  emailFilter,
  statusFilter,
])

export const searchSchema = tableSearchSchema(filtersSearchSchema, tableId, z.coerce.number())

export function ReviewsTable() {
  const search = useSearch({ from: "/reviews" })
  const navigate = useNavigate({ from: "/reviews" })

  const queryState = useTable({
    queryParams: search,
    setQueryParams: params => navigate({ search: params }),
    definedFilters: reviewFilters,
    tableId,
    defaultSortKey: SortKey.DateCreated,
    defaultSortDirection: "descend",
  })

  const { sortData, sortKey, isDescending } = useSorting(queryState.sorting)
  const { page, pageSize, getTablePagination, resetPage } = usePagination(queryState.pagination)

  const { applyFilters, filters } = useFilters<SearchQuery, InferFiltersSchema<typeof reviewFilters>>({
    filters: reviewFilters,
    initialValues: queryState.filters.values,
    onFiltersChange: (_, values) => {
      queryState.filters.onFiltersChange(values)
      resetPage()
    },
  })

  const { data, isPending, isPlaceholderData } = api.useSearchReviews(
    applyFilters({ PageNumber: page, PageSize: pageSize, SortBy: sortKey, SortByDescending: isDescending }),
    { placeholderData: keepPreviousData },
  )

  return (
    <Table
      columns={columns}
      dataSource={data?.items}
      loading={isPending || isPlaceholderData}
      pagination={getTablePagination(data?.totalCount)}
    />
  )
}
```

### Route Configuration

Use the combined search schema as `validateSearch` in a TanStack Router route:

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { searchSchema } from "./ReviewsTable"

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
  validateSearch: searchSchema,
})
```

### Standalone Table (Without URL State)

Use `useSorting`, `usePagination`, and `useFilters` directly when URL persistence is not needed:

```tsx
import { useSorting, usePagination, useFilters } from "@leancodepl/antd-table-hooks"
import { keepPreviousData } from "@tanstack/react-query"

export function SimpleTable() {
  const { sortData, sortKey, isDescending } = useSorting({
    defaultSortDirection: "descend",
    defaultSortKey: SortKey.CreatedAt,
  })

  const { page, pageSize, getTablePagination, resetPage } = usePagination()

  const { applyFilters, filters } = useFilters({
    filters: simpleFilters,
    onFiltersChange: resetPage,
  })

  const { data, isPending } = api.useSearch(
    applyFilters({ PageNumber: page, PageSize: pageSize, SortBy: sortKey, SortByDescending: isDescending }),
    { placeholderData: keepPreviousData },
  )

  return (
    <Table
      columns={columns}
      dataSource={data?.items}
      loading={isPending}
      pagination={getTablePagination(data?.totalCount)}
    />
  )
}
```

### Defining Filters

Filters are defined outside the component using `defineFilters`. Each filter is a `FilterDefinition` object describing
its ID, component, search schema entries, and how it transforms the query:

```tsx
import { defineFilters, FilterDefinition } from "@leancodepl/antd-table-hooks"

const tableId = "users"

const { searchSchema: usersFiltersSchema, filters: userFilters } = defineFilters<SearchQuery>()([
  emailTextFilter,
  stateSelectFilter,
  createdAtDateRangeFilter,
])
```

For context-dependent filters (e.g. internationalization):

```tsx
type FiltersContext = { intl: IntlShape }

const { searchSchema, filters: filtersFn } = defineFilters<SearchQuery, FiltersContext>()(context => [
  nameFilter(context?.intl),
])

// In the component:
const intl = useIntl()
const filtersDefinition = useMemo(() => filtersFn({ intl }), [intl])
```

### Implementing Custom Filter Definitions

This library does not ship filter UI components — you implement them in your application to match your design system. A
filter definition is an object satisfying the `FilterDefinition<TQuery, TValue, TId>` type:

| Property           | Type                                                                       | Description                                                                               |
| ------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `id`               | `string`                                                                   | Unique identifier for the filter within the table                                         |
| `component`        | `ComponentType<FilterProps>`                                               | React component receiving `{ applyFilter, reset$, initialValue }`                         |
| `searchSchema`     | `[key, ZodType][]` (optional)                                              | URL param key/schema pairs for serialization                                              |
| `buildApplyFilter` | `(value) => ((query) => query) \| undefined` (optional)                    | Reconstructs the filter function from a stored value (needed for initial/restored values) |
| `toSearchParams`   | `(value) => Record<string, unknown>` (required when `searchSchema` is set) | Serializes the filter value to URL params                                                 |
| `fromSearchParams` | `(params) => value \| undefined` (required when `searchSchema` is set)     | Deserializes URL params back to a filter value                                            |

Each filter component receives three props from `useFilters`:

- `applyFilter(filterFn, value)` — call with a query transform function when the value changes, or `undefined` to clear
- `reset$` — an RxJS Observable that emits when filters are reset; subscribe to clear local state
- `initialValue` — restored value when hydrating from URL params

#### Minimal Example

A simple text input filter showing the essential structure:

```tsx
import { useState, useEffect, useCallback } from "react"
import z from "zod"
import { FilterDefinition } from "@leancodepl/antd-table-hooks"

const schema = z.string().optional().catch(undefined)

export function textFilter<TQuery, const TId extends string, const TTableId extends string>({
  id,
  tableId,
  label,
  filter,
}: {
  id: TId
  tableId: TTableId
  label: string
  filter: (value: string, query: TQuery) => TQuery
}) {
  const paramKey = `${tableId}-${id}` as const

  return {
    id,

    component: ({ applyFilter, reset$, initialValue }) => {
      const [value, setValue] = useState(initialValue)

      const clear = useCallback(() => {
        setValue(undefined)
        applyFilter(undefined)
      }, [applyFilter])

      useEffect(() => {
        const sub = reset$.subscribe(clear)
        return () => sub.unsubscribe()
      }, [clear, reset$])

      return (
        <input
          placeholder={label}
          value={value}
          onChange={e => {
            const v = e.target.value
            setValue(v)
            applyFilter(v ? query => filter(v, query) : undefined, v)
          }}
        />
      )
    },

    buildApplyFilter: value => (value ? query => filter(value, query) : undefined),

    searchSchema: [[paramKey, schema]] as const,
    toSearchParams: value => ({ [paramKey]: value }),
    fromSearchParams: params => params[paramKey] as string | undefined,
  } satisfies FilterDefinition<TQuery, string, TId>
}
```

Usage:

```tsx
textFilter({
  id: "email",
  tableId: "users",
  label: "Email",
  filter: (email, query) => ({ ...query, EmailFilter: email }),
})
```

#### Key Implementation Patterns

**Single URL param** (text, select): use one `searchSchema` entry keyed as `{tableId}-{id}`.

```tsx
searchSchema: [[`${tableId}-${id}`, z.string().optional()]] as const
```

**Multiple URL params** (date ranges): use multiple `searchSchema` entries with distinct keys.

```tsx
searchSchema: [
  [`${tableId}-${id}-from`, z.string().optional()],
  [`${tableId}-${id}-to`, z.string().optional()],
] as const
```

**Clearing**: call `applyFilter(undefined)` when the filter value is empty or cleared. The `reset$` observable fires
when the user resets all filters — subscribe to it and clear local state.

**Restoring from URL**: `fromSearchParams` deserializes raw URL values back into the filter's value type.
`buildApplyFilter` reconstructs the query transform function from a deserialized value, enabling filter restoration on
page load.

### Reusable Table with Query Params from Parent

Pass query params as props to share the same table component across multiple pages:

```tsx
import { useSearch, useNavigate } from "@tanstack/react-router"
import z from "zod"

type UsersTableQueryParams = z.infer<typeof usersSearchSchema>

type UsersTableProps = {
  name: string
  queryParams: UsersTableQueryParams
  setQueryParams: (params: UsersTableQueryParams) => void
}

export function UsersTable({ name, queryParams, setQueryParams }: UsersTableProps) {
  const queryState = useTable({
    queryParams,
    setQueryParams,
    definedFilters: usersFilters,
    tableId: "users",
    defaultSortKey: SortKey.CreatedAt,
    defaultSortDirection: "descend",
  })

  // ... same pattern as full table example
}

// Parent page
export function UsersPage() {
  const search = useSearch({ from: "/users" })
  const navigate = useNavigate({ from: "/users" })

  return <UsersTable name="users" queryParams={search} setQueryParams={params => navigate({ search: params })} />
}
```
