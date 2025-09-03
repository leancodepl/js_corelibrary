import { useCallback, useEffect, useMemo, useState } from "react"
import { Area } from "react-easy-crop"
import { defaultCrop, defaultRotation, defaultZoom } from "../config"
import { FileWithId } from "../types"

export type UseCropperProps = {
  value?: FileWithId[]
  onChange?: (files: FileWithId[]) => void
}

export function useCropper({ value, onChange }: UseCropperProps) {
  const [cropperFiles, setCropperFiles] = useState<FileWithId[]>([])
  const [cropperModalImage, setCropperModalImage] = useState<string>()

  const [cropArea, setCropArea] = useState<Area>()
  const [crop, setCrop] = useState(defaultCrop)
  const [zoom, setZoom] = useState(defaultZoom)
  const [rotation, setRotation] = useState(defaultRotation)

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

  const isOpen = useMemo(() => !!currentCropperFile, [currentCropperFile])

  return {
    cropperFiles,
    currentCropperFile,
    cropperModalImage,
    cropArea,
    crop,
    zoom,
    rotation,
    isOpen,
    setCropperFiles,
    setCropperModalImage,
    setCropArea,
    setCrop,
    setZoom,
    setRotation,
    closeCurrentCropperFile,
    acceptCurrentCropperFile,
  }
}
