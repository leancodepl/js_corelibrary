import { ComponentType } from "react"
import { Observable } from "rxjs"
import { z } from "zod"

type FilterProps<TQuery, TSchema> = {
  applyFilter(applyFilter: ((query: TQuery) => TQuery) | undefined, value?: unknown): void
  reset$: Observable<unknown>
  initialValue?: TSchema
}

type SearchSchemaEntries = readonly (readonly [string, z.ZodType])[]

type InferSearchSchema<T extends SearchSchemaEntries> = {
  [E in T[number] as E[0]]: z.infer<E[1]>
}

export type FilterDefinition<
  TQuery,
  TValue = unknown,
  TId extends string = string,
  TSearchSchema extends SearchSchemaEntries = SearchSchemaEntries,
> = {
  id: TId
  component: ComponentType<FilterProps<TQuery, TValue>>
  searchSchema?: TSearchSchema
  buildApplyFilter?: (value: TValue) => ((query: TQuery) => TQuery) | undefined
  toSearchParams: (value: TValue) => InferSearchSchema<TSearchSchema>
  fromSearchParams: (params: InferSearchSchema<TSearchSchema>) => TValue | undefined
}

type ExtractSearchEntries<F> = F extends { searchSchema: infer SD extends SearchSchemaEntries } ? SD[number] : never

export type FiltersSearchSchemaShape<TFilters extends FilterDefinition<any, any, string>[]> = {
  [E in ExtractSearchEntries<TFilters[number]> as E[0]]: E[1]
}

export type InferFiltersSchema<TFilters extends FilterDefinition<any, any, string>[]> = {
  [K in TFilters[number] as K extends FilterDefinition<any, any, infer Id extends string>
    ? Id
    : never]: K extends FilterDefinition<any, infer S, any> ? S : never
}

export type DefinedSearchSchema<TFilters extends FilterDefinition<any, any, string>[]> = z.ZodObject<
  FiltersSearchSchemaShape<TFilters>
>
