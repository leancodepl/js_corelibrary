import { ErrorCode as DropzoneErrorCode, FileRejection } from "react-dropzone"

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
