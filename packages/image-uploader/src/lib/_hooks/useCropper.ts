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
  const [fileQueue, setFileQueue] = useState<FileWithId[]>([])
  const [editorImage, setEditorImage] = useState<string>()

  const [cropArea, setCropArea] = useState<Area>()
  const [crop, setCrop] = useState(defaultCrop)
  const [zoom, setZoom] = useState(defaultZoom)
  const [rotation, setRotation] = useState(defaultRotation)

  const file = fileQueue.at(0)
  const isOpen = !!file

  useSyncState(file, newCropperFile => {
    setEditorImage(undefined)

    if (!newCropperFile) {
      return
    }

    const reader = new FileReader()

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setEditorImage(reader.result)
      }
    })

    reader.readAsDataURL(newCropperFile.originalFile)
  })

  const closeImage = useCallback(() => {
    setFileQueue(fileQueue.filter(file => file.id !== file?.id))
  }, [fileQueue])

  const acceptImage = useCallback((file: FileWithId) => onChange?.([...(value ?? []), file]), [onChange, value])

  return {
    fileQueue,
    file,
    editorImage,
    cropArea,
    crop,
    zoom,
    rotation,
    isOpen,
    setFileQueue,
    setEditorImage,
    setCropArea,
    setCrop,
    setZoom,
    setRotation,
    closeImage,
    acceptImage,
  }
}
