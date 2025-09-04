import { useCallback } from "react"
import { Accept, FileRejection, useDropzone } from "react-dropzone"
import { v4 as uuid } from "uuid"
import { ErrorCode, mapFileRejectionsToErrorCode } from "../_utils/errors"
import { isExactFile } from "../_utils/isExactFile"
import { defaultAccept } from "../config"
import { FileWithId } from "../types"
import { CropperConfig } from "../UploadImages/Cropper"
import { useCropper } from "./useCropper"

/**
 * Configuration for the image upload hook.
 */
export type UseUploadImagesProps = {
  value?: FileWithId[]
  accept?: Accept
  cropper?: CropperConfig
  onError?: (errorCode: ErrorCode) => void
  onChange?: (files: FileWithId[]) => void
}

/**
 * Manages image upload state and provides drag-and-drop functionality.
 *
 * Creates a complete image upload solution with file validation, drag-and-drop support,
 * optional cropping, and duplicate detection. Returns upload state and control functions.
 *
 * @param value - Current array of uploaded files with IDs
 * @param accept - File types to accept (defaults to image types)
 * @param cropper - Optional cropper configuration for image editing
 * @param onError - Callback for handling upload errors
 * @param onChange - Callback when file list changes
 * @returns Upload state and control functions including dropzone props
 *
 * @example
 * ```typescript
 * import { useUploadImages } from "@leancodepl/image-uploader";
 *
 * const uploader = useUploadImages({
 *   value: files,
 *   onChange: setFiles,
 *   onError: (error) => console.error("Upload error:", error),
 *   accept: { "image/*": [".jpg", ".png"] }
 * });
 * ```
 */
export function useUploadImages({
  value,
  accept = defaultAccept,
  cropper: cropperConfig,
  onError,
  onChange,
}: UseUploadImagesProps) {
  const { setFileQueue: setCropperFileQueue, ...cropperProps } = useCropper({ value, onChange })

  const handleNewFiles = useCallback(
    (newFiles: FileWithId[]) => {
      if (cropperConfig) {
        setCropperFileQueue(newFiles)
      } else {
        onChange?.([...(value ?? []), ...newFiles])
      }
    },
    [cropperConfig, onChange, value, setCropperFileQueue],
  )

  const addFiles = useCallback(
    (newFiles: FileWithId[]) => {
      const uniqueNewFiles = newFiles.filter(
        newFile => !value?.some(existingFile => isExactFile(existingFile.originalFile, newFile.originalFile)),
      )

      handleNewFiles(uniqueNewFiles)
    },
    [handleNewFiles, value],
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

  const uploader = {
    value,
    dropzone,
    addFiles,
    removeFile,
    clearFiles,
    cropper: cropperConfig && {
      config: cropperConfig,
      ...cropperProps,
    },
  }

  return {
    ...uploader,
    uploader,
  }
}
