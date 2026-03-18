import { dartNameStyle } from "quicktype-core/dist/language/Dart/utils.js"

export function sectionPrefix(sectionKey: string): string {
  if (sectionKey === "hostMethods") return "Host"
  if (sectionKey === "remoteMethods") return "Remote"
  return ""
}

export function pascalCase(original: string): string {
  return dartNameStyle(true, false, original)
}
