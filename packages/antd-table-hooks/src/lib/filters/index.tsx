import z from "zod"
import { DefinedSearchSchema, FilterDefinition, FiltersSearchSchemaShape } from "./types"

export * from "./useFilters"
export * from "./types"

/**
 * Creates a typed filter definition factory along with a combined Zod search schema for URL param validation.
 * Call with a query type generic, then pass an array of filter definitions (or a factory function for
 * context-dependent filters). Returns `{ searchSchema, filters }` where `searchSchema` is used with
 * `tableSearchSchema` for route validation.
 *
 * @returns A function that accepts filter definitions and returns `{ searchSchema, filters }`
 *
 * @example
 * ```typescript
 * import { defineFilters, FilterDefinition } from "@leancodepl/antd-table-hooks";
 *
 * // Static filters
 * const { searchSchema, filters } = defineFilters<SearchQuery>()([
 *   myTextFilter({ id: "email", tableId: "users", label: "Email", filter: (v, q) => ({ ...q, Email: v }) }),
 * ]);
 *
 * // Context-dependent filters
 * const { searchSchema, filters: filtersFn } = defineFilters<SearchQuery, { intl: IntlShape }>()(
 *   context => [
 *     myTextFilter({ id: "name", tableId: "users", label: "Name", placeholder: context?.intl.formatMessage({ defaultMessage: "Name" }) }),
 *   ],
 * );
 * ```
 */
export function defineFilters<TQuery>(): <TFilters extends FilterDefinition<TQuery, any, string>[]>(
  filters: TFilters,
) => {
  searchSchema: DefinedSearchSchema<TFilters>
  filters: TFilters
}
export function defineFilters<TQuery, TContext extends Record<string, unknown>>(): <
  TFilters extends FilterDefinition<TQuery, any, string>[],
>(
  filters: (context?: TContext) => TFilters,
) => {
  searchSchema: DefinedSearchSchema<TFilters>
  filters: (context?: TContext) => TFilters
}
export function defineFilters<TQuery, TContext extends Record<string, unknown> | undefined = undefined>(): unknown {
  return function <TFilters extends FilterDefinition<TQuery, any, string>[]>(
    filters: ((context?: TContext) => TFilters) | TFilters,
  ):
    | {
        searchSchema: DefinedSearchSchema<TFilters>
        filters: (context?: TContext) => TFilters
      }
    | {
        searchSchema: DefinedSearchSchema<TFilters>
        filters: TFilters
      } {
    if (typeof filters === "function") {
      return {
        searchSchema: buildSearchSchema(filters()),
        filters,
      }
    }

    return {
      searchSchema: buildSearchSchema(filters),
      filters,
    }
  }
}

function buildSearchSchema<TFilters extends FilterDefinition<any, any, string>[]>(
  filters: TFilters,
): DefinedSearchSchema<TFilters> {
  return z.object(Object.fromEntries(filters.flatMap(f => f.searchSchema ?? []))) as z.ZodObject<
    FiltersSearchSchemaShape<TFilters>
  >
}
