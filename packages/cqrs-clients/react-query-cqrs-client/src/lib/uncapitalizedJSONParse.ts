import { toLowerFirst } from "@leancodepl/utils"

export function uncapitalizedJSONParse(json: string) {
  return JSON.parse(json, (key, value) => {
    if (value === null && key !== "") return undefined

    if (!value || Array.isArray(value) || typeof value !== "object") return value

    return Object.fromEntries(Object.entries(value).map(([key, value]) => [toLowerFirst(key), value]))
  })
}
