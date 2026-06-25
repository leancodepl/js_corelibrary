import { ErrorCode as DropzoneErrorCode, DropzoneOptions, FileRejection } from "react-dropzone"
import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ErrorCode } from "../_utils/errors"
import { FileWithId } from "../types"
import { useUploadImages } from "./useUploadImages"

// Capture the options passed to useDropzone so we can drive its callbacks directly.
let lastDropzoneOptions: DropzoneOptions | undefined

vi.mock("react-dropzone", async importOriginal => {
  const actual = await importOriginal<typeof import("react-dropzone")>()
  return {
    ...actual,
    useDropzone: (options: DropzoneOptions) => {
      lastDropzoneOptions = options
      return { isDragActive: false, getRootProps: () => ({}), getInputProps: () => ({}) }
    },
  }
})

let uuidCounter = 0
vi.mock("uuid", () => ({
  v4: () => `uuid-${++uuidCounter}`,
}))

function mkFile(name: string, content = "x", lastModified = 1000) {
  return new File([content], name, { type: "image/png", lastModified })
}

function mkFileWithId(name: string, id: string): FileWithId {
  return { originalFile: mkFile(name), id }
}

describe("useUploadImages", () => {
  beforeEach(() => {
    uuidCounter = 0
    lastDropzoneOptions = undefined
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("exposes the current value and a nested uploader object", () => {
    const value = [mkFileWithId("a.png", "1")]
    const { result } = renderHook(() => useUploadImages({ value }))

    expect(result.current.value).toBe(value)
    expect(result.current.uploader.value).toBe(value)
    expect(typeof result.current.addFiles).toBe("function")
    expect(typeof result.current.removeFile).toBe("function")
    expect(typeof result.current.clearFiles).toBe("function")
  })

  it("passes the provided accept config through to useDropzone", () => {
    const accept = { "image/png": [".png"] }
    renderHook(() => useUploadImages({ accept }))

    expect(lastDropzoneOptions?.accept).toEqual(accept)
  })

  it("falls back to the default accept when none provided", () => {
    renderHook(() => useUploadImages({}))

    expect(lastDropzoneOptions?.accept).toEqual({ "image/*": [] })
  })

  it("addFiles appends new files to the existing value via onChange", () => {
    const value = [mkFileWithId("a.png", "1")]
    const onChange = vi.fn()
    const { result } = renderHook(() => useUploadImages({ value, onChange }))

    const newFile = mkFileWithId("b.png", "2")
    act(() => result.current.addFiles([newFile]))

    expect(onChange).toHaveBeenCalledWith([...value, newFile])
  })

  it("addFiles filters out duplicates already present in value", () => {
    const existing = mkFileWithId("a.png", "1")
    const onChange = vi.fn()
    const { result } = renderHook(() => useUploadImages({ value: [existing], onChange }))

    // Same underlying file content/name/lastModified => duplicate.
    const duplicate: FileWithId = { originalFile: mkFile("a.png"), id: "dup" }
    const fresh = mkFileWithId("b.png", "2")

    act(() => result.current.addFiles([duplicate, fresh]))

    expect(onChange).toHaveBeenCalledWith([existing, fresh])
  })

  it("removeFile removes the file with the matching id", () => {
    const a = mkFileWithId("a.png", "1")
    const b = mkFileWithId("b.png", "2")
    const onChange = vi.fn()
    const { result } = renderHook(() => useUploadImages({ value: [a, b], onChange }))

    act(() => result.current.removeFile("1"))

    expect(onChange).toHaveBeenCalledWith([b])
  })

  it("clearFiles empties the list", () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useUploadImages({ value: [mkFileWithId("a.png", "1")], onChange }))

    act(() => result.current.clearFiles())

    expect(onChange).toHaveBeenCalledWith([])
  })

  it("onDrop wraps accepted files with generated ids and adds them", () => {
    const onChange = vi.fn()
    renderHook(() => useUploadImages({ value: [], onChange }))

    const dropped = mkFile("c.png")
    act(() => lastDropzoneOptions?.onDrop?.([dropped], [], {} as never))

    expect(onChange).toHaveBeenCalledWith([{ originalFile: dropped, id: "uuid-1" }])
  })

  it("onDropRejected maps rejections to an error code and forwards to onError", () => {
    const onError = vi.fn()
    renderHook(() => useUploadImages({ onError }))

    const rejections: FileRejection[] = [
      { file: mkFile("big.png"), errors: [{ code: DropzoneErrorCode.FileTooLarge, message: "too big" }] },
    ]
    act(() => lastDropzoneOptions?.onDropRejected?.(rejections, {} as never))

    expect(onError).toHaveBeenCalledWith(ErrorCode.FileTooLarge)
  })

  it("does not throw when callbacks are omitted", () => {
    const { result } = renderHook(() => useUploadImages({}))

    expect(() => act(() => result.current.clearFiles())).not.toThrow()
    expect(() => act(() => result.current.removeFile("nope"))).not.toThrow()
  })

  it("does not expose a cropper object when no cropper config is provided", () => {
    const { result } = renderHook(() => useUploadImages({}))

    expect(result.current.cropper).toBeUndefined()
  })

  it("exposes the cropper config when provided", () => {
    const cropper = { aspect: 1 }
    const { result } = renderHook(() => useUploadImages({ cropper }))

    expect(result.current.cropper?.config).toBe(cropper)
  })
})
