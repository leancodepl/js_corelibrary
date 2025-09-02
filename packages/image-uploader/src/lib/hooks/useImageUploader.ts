import { useCallback } from "react"
import { Accept, FileRejection, useDropzone } from "react-dropzone"
import { v4 as uuid } from "uuid"
import { ErrorCode, mapFileRejectionsToErrorCode } from "../_utils/errors"
import { isExactFile } from "../_utils/isExactFile"
import { defaultAccept } from "../config"
import { FileWithId } from "../types"

export type UseImageUploaderProps = {
  value?: FileWithId[]
  accept?: Accept
  onError?: (errorCode: ErrorCode) => void
  onChange?: (files: FileWithId[]) => void
}

export function useImageUploader({ value, accept = defaultAccept, onError, onChange }: UseImageUploaderProps) {
  const addFiles = useCallback(
    (newFiles: FileWithId[]) => {
      const uniqueNewFiles = newFiles.filter(
        newFile => !value?.some(existingFile => isExactFile(existingFile.originalFile, newFile.originalFile)),
      )
      onChange?.([...(value ?? []), ...uniqueNewFiles])
    },
    [value, onChange],
  )

  const removeFile = useCallback(
    (id: string) => {
      onChange?.(value?.filter(f => f.id !== id) ?? [])
    },
    [value, onChange],
  )

  const clearFiles = useCallback(() => {
    onChange?.([])
  }, [onChange])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      addFiles(acceptedFiles.map(file => ({ originalFile: file, id: uuid() })))
    },
    [addFiles],
  )

  const handleDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      onError?.(mapFileRejectionsToErrorCode(fileRejections))
    },
    [onError],
  )

  const dropzone = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    accept,
  })

  return {
    value,
    dropzone,
    addFiles,
    removeFile,
    clearFiles,
  }
}
