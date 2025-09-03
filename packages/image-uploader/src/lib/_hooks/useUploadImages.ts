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
  onError?: (errorCode: ErrorCode) => void
  onChange?: (files: FileWithId[]) => void
  cropper?: CropperConfig
}

export function useUploadImages({ value, accept = defaultAccept, onError, onChange, cropper }: UseUploadImagesProps) {
  const {
    cropperFiles,
    currentCropperFile,
    cropperModalImage,
    cropArea,
    crop,
    zoom,
    rotation,
    isOpen,
    setCropperFiles,
    setCropArea,
    setCrop,
    setZoom,
    setRotation,
    closeCurrentCropperFile,
    acceptCurrentCropperFile,
  } = useCropper({ value, onChange })

  const handleNewFiles = useCallback(
    (newFiles: FileWithId[]) => {
      if (cropper) {
        setCropperFiles(newFiles)
      } else {
        onChange?.([...(value ?? []), ...newFiles])
      }
    },
    [cropper, onChange, value, setCropperFiles],
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
      config: cropper,
      files: cropperFiles,
      modalImage: cropperModalImage,
      currentFile: currentCropperFile,
      isOpen,
      close: closeCurrentCropperFile,
      accept: acceptCurrentCropperFile,
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
