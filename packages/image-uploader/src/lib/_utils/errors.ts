import { ErrorCode as DropzoneErrorCode, FileRejection } from "react-dropzone"

/**
 * Error codes for file upload validation failures.
 *
 * Wraps `"react-dropzone"` error codes with an additional Unknown state.
 *
 * @example
 * ```typescript
 * import { ErrorCode } from "@leancodepl/image-uploader";
 *
 * if (errorCode === ErrorCode.FileTooLarge) {
 *   console.log("File exceeds maximum size limit");
 * }
 * ```
 */
export enum ErrorCode {
  FileTooLarge = DropzoneErrorCode.FileTooLarge,
  FileTooSmall = DropzoneErrorCode.FileTooSmall,
  FileInvalidType = DropzoneErrorCode.FileInvalidType,
  TooManyFiles = DropzoneErrorCode.TooManyFiles,
  Unknown = "unknown",
}

function getFlatErrorCodes(fileRejections: FileRejection[]) {
  return fileRejections.flatMap(fileRejection => fileRejection.errors.map(error => error.code))
}

function getErrorCode(errorCodes: (DropzoneErrorCode | string)[]) {
  if (errorCodes.includes(DropzoneErrorCode.FileTooLarge)) {
    return ErrorCode.FileTooLarge
  }
  if (errorCodes.includes(DropzoneErrorCode.FileTooSmall)) {
    return ErrorCode.FileTooSmall
  }
  if (errorCodes.includes(DropzoneErrorCode.FileInvalidType)) {
    return ErrorCode.FileInvalidType
  }
  if (errorCodes.includes(DropzoneErrorCode.TooManyFiles)) {
    return ErrorCode.TooManyFiles
  }
  return ErrorCode.Unknown
}

export function mapFileRejectionsToErrorCode(fileRejections: FileRejection[]) {
  return getErrorCode(getFlatErrorCodes(fileRejections))
}
