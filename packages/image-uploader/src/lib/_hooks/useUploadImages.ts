import { useCallback, useEffect, useMemo, useState } from "react"
import { Accept, FileRejection, useDropzone } from "react-dropzone"
import { Area } from "react-easy-crop"
import { v4 as uuid } from "uuid"
import { ErrorCode, mapFileRejectionsToErrorCode } from "../_utils/errors"
import { isExactFile } from "../_utils/isExactFile"
import { defaultAccept } from "../config"
import { FileWithId } from "../types"
import { CropperConfig } from "../UploadImages/Cropper"

export type UseUploadImagesProps = {
  value?: FileWithId[]
  accept?: Accept
  onError?: (errorCode: ErrorCode) => void
  onChange?: (files: FileWithId[]) => void
  cropper?: CropperConfig
}

export function useUploadImages({ value, accept = defaultAccept, onError, onChange, cropper }: UseUploadImagesProps) {
  const [cropperFiles, setCropperFiles] = useState<FileWithId[]>([])
  const [cropperModalImage, setCropperModalImage] = useState<string>()

  const [cropArea, setCropArea] = useState<Area>()
  const [crop, setCrop] = useState(defaultCrop)
  const [zoom, setZoom] = useState(defaultZoom)
  const [rotation, setRotation] = useState(defaultRotation)

  const handleNewFiles = useCallback(
    (newFiles: FileWithId[]) => {
      if (cropper) {
        setCropperFiles(newFiles)
      } else {
        onChange?.([...(value ?? []), ...newFiles])
      }
    },
    [cropper, onChange, value],
  )

  const currentCropperFile = useMemo(() => cropperFiles.at(0), [cropperFiles])

  useEffect(() => {
    setCropperModalImage(undefined)

    if (!currentCropperFile) {
      return
    }

    const reader = new FileReader()

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setCropperModalImage(reader.result)
      }
    })

    reader.readAsDataURL(currentCropperFile.originalFile)
  }, [currentCropperFile])

  const closeCurrentCropperFile = useCallback(() => {
    setCropperFiles(cropperFiles.filter(file => file.id !== currentCropperFile?.id))
  }, [cropperFiles, currentCropperFile?.id])

  const acceptCurrentCropperFile = useCallback(
    (file: FileWithId) => {
      if (!file) return
      onChange?.([...(value ?? []), file])
    },
    [onChange, value],
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
      close: closeCurrentCropperFile,
      accept: acceptCurrentCropperFile,
      // ???
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

const defaultCrop = { x: 0, y: 0 }
const defaultZoom = 1
const defaultRotation = 0
