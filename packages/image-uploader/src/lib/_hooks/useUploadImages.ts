import { useCallback } from "react"
import { Accept, FileRejection, useDropzone } from "react-dropzone"
import { v4 as uuid } from "uuid"
import { ErrorCode, mapFileRejectionsToErrorCode } from "../_utils/errors"
import { isExactFile } from "../_utils/isExactFile"
import { defaultAccept } from "../config"
import { FileWithId } from "../types"
import { CropperConfig } from "../UploadImages/Cropper"
import { useCropper } from "./useCropper"

export type UseUploadImagesProps = {
  value?: FileWithId[]
  accept?: Accept
  cropper?: CropperConfig
  onError?: (errorCode: ErrorCode) => void
  onChange?: (files: FileWithId[]) => void
}

export function useUploadImages({
  value,
  accept = defaultAccept,
  cropper: cropperConfig,
  onError,
  onChange,
}: UseUploadImagesProps) {
  const {
    cropperFileQueue,
    cropperFile,
    cropperEditorImage,
    cropArea,
    crop,
    zoom,
    rotation,
    isOpen,
    setCropperFileQueue,
    setCropArea,
    setCrop,
    setZoom,
    setRotation,
    closeCropperFile,
    acceptCropperFile,
  } = useCropper({ value, onChange })

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
    cropper: {
      config: cropperConfig,
      fileQueue: cropperFileQueue,
      file: cropperFile,
      editorImage: cropperEditorImage,
      isOpen,
      close: closeCropperFile,
      accept: acceptCropperFile,
      cropArea,
      crop,
      zoom,
      rotation,
      setCropArea,
      setCrop,
      setZoom,
      setRotation,
    },
  }

  return {
    ...uploader,
    uploader,
  }
}
