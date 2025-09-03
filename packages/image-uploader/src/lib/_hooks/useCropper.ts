import { useCallback, useState } from "react"
import { Area } from "react-easy-crop"
import { defaultCrop, defaultRotation, defaultZoom } from "../config"
import { FileWithId } from "../types"
import { useSyncState } from "./useSyncState"

export type UseCropperProps = {
  value?: FileWithId[]
  onChange?: (files: FileWithId[]) => void
}

export function useCropper({ value, onChange }: UseCropperProps) {
  const [cropperFileQueue, setCropperFileQueue] = useState<FileWithId[]>([])
  const [cropperEditorImage, setCropperEditorImage] = useState<string>()

  const [cropArea, setCropArea] = useState<Area>()
  const [crop, setCrop] = useState(defaultCrop)
  const [zoom, setZoom] = useState(defaultZoom)
  const [rotation, setRotation] = useState(defaultRotation)

  const cropperFile = cropperFileQueue.at(0)
  const isOpen = !!cropperFile

  useSyncState(cropperFile, () => {
    setCropperEditorImage(undefined)

    if (!cropperFile) {
      return
    }

    const reader = new FileReader()

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setCropperEditorImage(reader.result)
      }
    })

    reader.readAsDataURL(cropperFile.originalFile)
  })

  const closeCropperFile = useCallback(() => {
    setCropperFileQueue(cropperFileQueue.filter(file => file.id !== cropperFile?.id))
  }, [cropperFileQueue, cropperFile?.id])

  const acceptCropperFile = useCallback((file: FileWithId) => onChange?.([...(value ?? []), file]), [onChange, value])

  return {
    cropperFileQueue,
    cropperFile,
    cropperEditorImage,
    cropArea,
    crop,
    zoom,
    rotation,
    isOpen,
    setCropperFileQueue,
    setCropperEditorImage,
    setCropArea,
    setCrop,
    setZoom,
    setRotation,
    closeCropperFile,
    acceptCropperFile,
  }
}
