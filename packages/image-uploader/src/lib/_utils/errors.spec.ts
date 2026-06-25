import { ErrorCode as DropzoneErrorCode, FileRejection } from "react-dropzone"
import { describe, expect, it } from "vitest"
import { ErrorCode, mapFileRejectionsToErrorCode } from "./errors"

function mkRejection(...codes: (DropzoneErrorCode | string)[]): FileRejection {
  return {
    file: new File(["x"], "x.png", { type: "image/png" }),
    errors: codes.map(code => ({ code, message: `error: ${code}` })),
  } as FileRejection
}

describe("ErrorCode enum", () => {
  it("mirrors react-dropzone codes and adds Unknown", () => {
    expect(ErrorCode.FileTooLarge).toBe(DropzoneErrorCode.FileTooLarge)
    expect(ErrorCode.FileTooSmall).toBe(DropzoneErrorCode.FileTooSmall)
    expect(ErrorCode.FileInvalidType).toBe(DropzoneErrorCode.FileInvalidType)
    expect(ErrorCode.TooManyFiles).toBe(DropzoneErrorCode.TooManyFiles)
    expect(ErrorCode.Unknown).toBe("unknown")
  })
})

describe("mapFileRejectionsToErrorCode", () => {
  it("maps a single FileTooLarge rejection", () => {
    expect(mapFileRejectionsToErrorCode([mkRejection(DropzoneErrorCode.FileTooLarge)])).toBe(ErrorCode.FileTooLarge)
  })

  it("maps FileTooSmall", () => {
    expect(mapFileRejectionsToErrorCode([mkRejection(DropzoneErrorCode.FileTooSmall)])).toBe(ErrorCode.FileTooSmall)
  })

  it("maps FileInvalidType", () => {
    expect(mapFileRejectionsToErrorCode([mkRejection(DropzoneErrorCode.FileInvalidType)])).toBe(
      ErrorCode.FileInvalidType,
    )
  })

  it("maps TooManyFiles", () => {
    expect(mapFileRejectionsToErrorCode([mkRejection(DropzoneErrorCode.TooManyFiles)])).toBe(ErrorCode.TooManyFiles)
  })

  it("returns Unknown for unrecognized codes", () => {
    expect(mapFileRejectionsToErrorCode([mkRejection("some-custom-code")])).toBe(ErrorCode.Unknown)
  })

  it("returns Unknown for an empty rejection list", () => {
    expect(mapFileRejectionsToErrorCode([])).toBe(ErrorCode.Unknown)
  })

  it("returns Unknown when a rejection has no errors", () => {
    expect(mapFileRejectionsToErrorCode([mkRejection()])).toBe(ErrorCode.Unknown)
  })

  it("prioritizes FileTooLarge over later-checked codes regardless of order", () => {
    const result = mapFileRejectionsToErrorCode([
      mkRejection(DropzoneErrorCode.TooManyFiles, DropzoneErrorCode.FileTooLarge),
    ])
    expect(result).toBe(ErrorCode.FileTooLarge)
  })

  it("respects the priority order FileTooLarge > FileTooSmall > FileInvalidType > TooManyFiles", () => {
    const result = mapFileRejectionsToErrorCode([
      mkRejection(DropzoneErrorCode.FileInvalidType),
      mkRejection(DropzoneErrorCode.FileTooSmall),
    ])
    // FileTooSmall is checked before FileInvalidType
    expect(result).toBe(ErrorCode.FileTooSmall)
  })

  it("flattens errors across multiple rejections", () => {
    const result = mapFileRejectionsToErrorCode([
      mkRejection("noise"),
      mkRejection(DropzoneErrorCode.TooManyFiles),
    ])
    expect(result).toBe(ErrorCode.TooManyFiles)
  })
})
