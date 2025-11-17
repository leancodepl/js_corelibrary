import { uncapitalizeDeep } from "@leancodepl/utils"
import { uncapitalizedJSONParse } from "../src/lib/uncapitalizedJSONParse"

describe("uncapitalizedJSONParse", () => {
  it("handles primitive types", () => {
    expect(uncapitalizedJSONParse(`"string"`)).toBe("string")

    expect(uncapitalizedJSONParse("false")).toBe(false)
    expect(uncapitalizedJSONParse("true")).toBe(true)

    expect(uncapitalizedJSONParse("2208")).toBe(2208)

    expect(uncapitalizedJSONParse("null")).toBe(null)
  })

  it("handles simple arrays", () => {
    expect(uncapitalizedJSONParse(JSON.stringify(simpleArray))).toEqual(transformedSimpleArray)
  })

  it("handles objects and complex arrays", () => {
    expect(uncapitalizedJSONParse(JSON.stringify(capitalizedSimpleObject))).toEqual(
      uncapitalizeDeep(capitalizedSimpleObject),
    )
    expect(uncapitalizedJSONParse(JSON.stringify(capitalizedArrayWithObject))).toEqual(
      uncapitalizeDeep(capitalizedArrayWithObject),
    )
    expect(uncapitalizedJSONParse(JSON.stringify(capitalizedComplexObject))).toEqual(
      uncapitalizeDeep(capitalizedComplexObject),
    )
  })
})

const simpleArray = ["a", 0, true, null, undefined]
const transformedSimpleArray = simpleArray.map(value => value ?? undefined)

const capitalizedArrayWithObject = [
  "aaa",
  12,
  { NestedKey3: false, NestedKey4: { NestedKey5: { NestedKey6: "w" } } },
] as const

const capitalizedSimpleObject = {
  Key1: { NestedKey1: "value", NestedKey2: 12 },
} as const

const capitalizedComplexObject = {
  ...capitalizedSimpleObject,
  Key2: capitalizedArrayWithObject,
} as const
