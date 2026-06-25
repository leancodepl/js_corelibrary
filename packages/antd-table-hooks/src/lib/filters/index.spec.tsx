import { z } from "zod"
import { defineFilters } from "."
import { FilterDefinition } from "./types"

type Query = { Name?: string; Age?: number }

function makeNameFilter(): FilterDefinition<Query, string, "name"> {
  return {
    id: "name",
    component: () => null,
    searchSchema: [["nameParam", z.string().optional()]] as const,
    toSearchParams: value => ({ nameParam: value }),
    fromSearchParams: (params: { nameParam?: string }) => params.nameParam,
    buildApplyFilter: value => query => ({ ...query, Name: value }),
  }
}

function makeAgeFilter(): FilterDefinition<Query, number, "age"> {
  return {
    id: "age",
    component: () => null,
    searchSchema: [["ageParam", z.coerce.number().optional()]] as const,
    toSearchParams: value => ({ ageParam: value }),
    fromSearchParams: (params: { ageParam?: number }) => params.ageParam,
  }
}

function makeSchemalessFilter(): FilterDefinition<Query, string, "plain"> {
  return {
    id: "plain",
    component: () => null,
  }
}

describe("defineFilters", () => {
  describe("array (static) form", () => {
    it("returns the filters unchanged", () => {
      // arrange
      const filters = [makeNameFilter(), makeAgeFilter()]

      // act
      const result = defineFilters<Query>()(filters)

      // assert
      expect(result.filters).toBe(filters)
    })

    it("builds a combined search schema from all filter entries", () => {
      // arrange / act
      const { searchSchema } = defineFilters<Query>()([makeNameFilter(), makeAgeFilter()])

      // assert
      const parsed = searchSchema.parse({ nameParam: "john", ageParam: "30" })
      expect(parsed).toEqual({ nameParam: "john", ageParam: 30 })
    })

    it("ignores filters that declare no search schema", () => {
      // arrange / act
      const { searchSchema } = defineFilters<Query>()([makeNameFilter(), makeSchemalessFilter()])

      // assert
      expect(Object.keys(searchSchema.shape)).toEqual(["nameParam"])
    })

    it("produces an empty schema when no filters declare a schema", () => {
      // arrange / act
      const { searchSchema } = defineFilters<Query>()([makeSchemalessFilter()])

      // assert
      expect(Object.keys(searchSchema.shape)).toEqual([])
      expect(searchSchema.parse({})).toEqual({})
    })
  })

  describe("factory (context) form", () => {
    it("preserves the factory function and derives the schema from invoking it", () => {
      // arrange
      const factory = () => [makeNameFilter()]

      // act
      const { searchSchema, filters } = defineFilters<Query, { locale: string }>()(factory)

      // assert
      expect(filters).toBe(factory)
      expect(Object.keys(searchSchema.shape)).toEqual(["nameParam"])
    })
  })
})
