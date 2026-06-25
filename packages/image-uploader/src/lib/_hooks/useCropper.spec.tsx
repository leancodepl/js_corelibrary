import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { defaultCrop, defaultRotation, defaultZoom } from "../config"
import { FileWithId } from "../types"
import { useCropper } from "./useCropper"

function mkFileWithId(name: string, id: string): FileWithId {
  return { originalFile: new File(["data"], name, { type: "image/png", lastModified: 1 }), id }
}

describe("useCropper", () => {
  it("starts closed with default crop/zoom/rotation and an empty queue", () => {
    const { result } = renderHook(() => useCropper({}))

    expect(result.current.isOpen).toBe(false)
    expect(result.current.file).toBeUndefined()
    expect(result.current.fileQueue).toEqual([])
    expect(result.current.crop).toEqual(defaultCrop)
    expect(result.current.zoom).toBe(defaultZoom)
    expect(result.current.rotation).toBe(defaultRotation)
  })

  it("opens with the first queued file when the queue is populated", () => {
    const a = mkFileWithId("a.png", "1")
    const b = mkFileWithId("b.png", "2")
    const { result } = renderHook(() => useCropper({}))

    act(() => result.current.setFileQueue([a, b]))

    expect(result.current.isOpen).toBe(true)
    expect(result.current.file).toBe(a)
  })

  it("loads the active file into editorImage via FileReader", async () => {
    const a = mkFileWithId("a.png", "1")
    const { result } = renderHook(() => useCropper({}))

    act(() => result.current.setFileQueue([a]))

    await waitFor(() => {
      expect(result.current.editorImage).toMatch(/^data:/)
    })
  })

  it("closeImage drops the current file from the queue and advances to the next", () => {
    const a = mkFileWithId("a.png", "1")
    const b = mkFileWithId("b.png", "2")
    const { result } = renderHook(() => useCropper({}))

    act(() => result.current.setFileQueue([a, b]))
    act(() => result.current.closeImage())

    expect(result.current.fileQueue).toEqual([b])
    expect(result.current.file).toBe(b)
    expect(result.current.isOpen).toBe(true)
  })

  it("closeImage on the last file empties the queue and closes", () => {
    const a = mkFileWithId("a.png", "1")
    const { result } = renderHook(() => useCropper({}))

    act(() => result.current.setFileQueue([a]))
    act(() => result.current.closeImage())

    expect(result.current.fileQueue).toEqual([])
    expect(result.current.isOpen).toBe(false)
  })

  it("acceptImage appends the file to the existing value via onChange", () => {
    const existing = mkFileWithId("existing.png", "0")
    const onChange = vi.fn()
    const { result } = renderHook(() => useCropper({ value: [existing], onChange }))

    const accepted = mkFileWithId("new.png", "1")
    act(() => result.current.acceptImage(accepted))

    expect(onChange).toHaveBeenCalledWith([existing, accepted])
  })

  it("acceptImage works when value is undefined", () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useCropper({ onChange }))

    const accepted = mkFileWithId("new.png", "1")
    act(() => result.current.acceptImage(accepted))

    expect(onChange).toHaveBeenCalledWith([accepted])
  })

  it("exposes setters that update crop/zoom/rotation/cropArea state", () => {
    const { result } = renderHook(() => useCropper({}))

    act(() => {
      result.current.setZoom(2)
      result.current.setRotation(90)
      result.current.setCrop({ x: 5, y: 6 })
      result.current.setCropArea({ x: 0, y: 0, width: 10, height: 10 })
    })

    expect(result.current.zoom).toBe(2)
    expect(result.current.rotation).toBe(90)
    expect(result.current.crop).toEqual({ x: 5, y: 6 })
    expect(result.current.cropArea).toEqual({ x: 0, y: 0, width: 10, height: 10 })
  })
})
