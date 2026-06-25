import { describe, expect, it } from "vitest"
import { getImagePreviewData } from "./getImagePreviewData"

describe("getImagePreviewData", () => {
  it("returns a base64 data URL for a real file", async () => {
    const file = new File(["hello world"], "photo.png", { type: "image/png" })

    const result = await getImagePreviewData(file)

    expect(result).toMatch(/^data:/)
    // "hello world" base64-encoded
    expect(result).toContain("aGVsbG8gd29ybGQ=")
  })

  it("preserves the MIME type in the data URL prefix", async () => {
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" })

    const result = await getImagePreviewData(file)

    expect(result.startsWith("data:image/jpeg;base64,")).toBe(true)
  })

  it("returns an empty string when no file is provided", async () => {
    const result = await getImagePreviewData(undefined as unknown as File)

    expect(result).toBe("")
  })

  it("rejects when the underlying reader errors", async () => {
    class FailingReader {
      onload: (() => void) | null = null
      onerror: ((err: unknown) => void) | null = null
      result: string | null = null
      readAsDataURL() {
        // Simulate an async read failure.
        queueMicrotask(() => this.onerror?.(new Error("read failed")))
      }
    }

    const original = globalThis.FileReader
    // @ts-expect-error overriding for the duration of this test
    globalThis.FileReader = FailingReader

    try {
      const file = new File(["x"], "photo.png", { type: "image/png" })
      await expect(getImagePreviewData(file)).rejects.toBeInstanceOf(Error)
    } finally {
      globalThis.FileReader = original
    }
  })
})
