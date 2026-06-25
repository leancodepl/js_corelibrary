import { afterEach, describe, expect, it, vi } from "vitest"
import { FileWithId, UploadedFileWithId, UploadParams } from "../types"
import { tryUploadWithUploadParams } from "./tryUploadWithUploadParams"

function mkFileWithId(): FileWithId {
  return {
    originalFile: new File(["data"], "photo.png", { type: "image/png" }),
    id: "id-1",
  }
}

const uploadParams: UploadParams = {
  uri: "https://api.example.com/upload",
  method: "PUT",
  requiredHeaders: { "x-amz-acl": "public-read" },
}

describe("tryUploadWithUploadParams", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns the image unchanged when it is already uploaded (has url)", async () => {
    const already: UploadedFileWithId = { ...mkFileWithId(), url: "https://cdn.example.com/x.png" }
    const getUploadParams = vi.fn()

    const result = await tryUploadWithUploadParams(already, getUploadParams)

    expect(result).toBe(already)
    expect(getUploadParams).not.toHaveBeenCalled()
  })

  it("throws when the originalFile is missing", async () => {
    const broken = { id: "id-1", originalFile: undefined } as unknown as FileWithId

    await expect(tryUploadWithUploadParams(broken, vi.fn())).rejects.toThrow("Image is not defined")
  })

  it("uploads via fetch using the returned params and resolves with the uri as url", async () => {
    const image = mkFileWithId()
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response)
    const getUploadParams = vi.fn().mockResolvedValue(uploadParams)

    const result = await tryUploadWithUploadParams(image, getUploadParams)

    expect(getUploadParams).toHaveBeenCalledWith(image)
    expect(fetchMock).toHaveBeenCalledWith(uploadParams.uri, {
      method: uploadParams.method,
      headers: uploadParams.requiredHeaders,
      body: image.originalFile,
    })
    expect(result).toEqual({ ...image, url: uploadParams.uri })
  })

  it("throws a wrapped error when upload params are null", async () => {
    const image = mkFileWithId()
    const fetchMock = vi.spyOn(globalThis, "fetch")
    const getUploadParams = vi.fn().mockResolvedValue(null)

    await expect(tryUploadWithUploadParams(image, getUploadParams)).rejects.toThrow("Failed to upload image")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("throws a wrapped error when the response is not ok", async () => {
    const image = mkFileWithId()
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response)
    const getUploadParams = vi.fn().mockResolvedValue(uploadParams)

    await expect(tryUploadWithUploadParams(image, getUploadParams)).rejects.toThrow("Failed to upload image")
  })

  it("throws a wrapped error when fetch itself rejects", async () => {
    const image = mkFileWithId()
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"))
    const getUploadParams = vi.fn().mockResolvedValue(uploadParams)

    await expect(tryUploadWithUploadParams(image, getUploadParams)).rejects.toThrow("Failed to upload image")
  })

  it("throws a wrapped error when getUploadParams itself rejects", async () => {
    const image = mkFileWithId()
    const getUploadParams = vi.fn().mockRejectedValue(new Error("boom"))

    await expect(tryUploadWithUploadParams(image, getUploadParams)).rejects.toThrow("Failed to upload image")
  })
})
