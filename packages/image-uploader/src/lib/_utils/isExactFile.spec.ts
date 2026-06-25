import { describe, expect, it } from "vitest"
import { isExactFile } from "./isExactFile"

function mkFile(name: string, content: string, lastModified: number) {
  return new File([content], name, { type: "image/png", lastModified })
}

describe("isExactFile", () => {
  it("returns true for files with identical name, size and lastModified", () => {
    const a = mkFile("photo.png", "hello", 1000)
    const b = mkFile("photo.png", "hello", 1000)
    expect(isExactFile(a, b)).toBe(true)
  })

  it("returns true when comparing a file to itself", () => {
    const a = mkFile("photo.png", "hello", 1000)
    expect(isExactFile(a, a)).toBe(true)
  })

  it("returns false when names differ", () => {
    const a = mkFile("a.png", "hello", 1000)
    const b = mkFile("b.png", "hello", 1000)
    expect(isExactFile(a, b)).toBe(false)
  })

  it("returns false when sizes differ", () => {
    const a = mkFile("photo.png", "hello", 1000)
    const b = mkFile("photo.png", "hello world", 1000)
    expect(isExactFile(a, b)).toBe(false)
  })

  it("returns false when lastModified differ", () => {
    const a = mkFile("photo.png", "hello", 1000)
    const b = mkFile("photo.png", "hello", 2000)
    expect(isExactFile(a, b)).toBe(false)
  })
})
