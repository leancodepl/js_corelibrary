import { ReactNode, useCallback } from "react"
import { defaultCrop, defaultRotation, defaultZoom } from "../../config"
import { FileWithId } from "../../types"
import { useUploadImagesContext } from "../Provider"

export type UploadImagesCropperProps = {
  children: ({
    zoom,
    rotation,
    setZoom,
    setRotation,
    accept,
    close,
  }: {
    zoom: number
    rotation: number
    setZoom: (zoom: number) => void
    setRotation: (rotation: number) => void
    accept: () => void
    close: () => void
  }) => ReactNode
}

export function UploadImagesCropper({ children }: UploadImagesCropperProps) {
  const {
    cropper: {
      currentFile,
      modalImage,
      accept: onAccept,
      close: onClose,
      config,
      cropArea,
      zoom,
      rotation,
      setCropArea,
      setCrop,
      setZoom,
      setRotation,
    },
  } = useUploadImagesContext()

  const close = useCallback(() => {
    onClose()
    setCrop(defaultCrop)
    setZoom(defaultZoom)
    setRotation(defaultRotation)
    setCropArea(undefined)
  }, [onClose, setCrop, setCropArea, setRotation, setZoom])

  const accept = useCallback(() => {
    if (!modalImage || !config) return

    const canvas = document.createElement("canvas")
    const canvas2 = document.createElement("canvas")
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    const ctx2 = canvas2.getContext("2d") as CanvasRenderingContext2D

    const img = new Image()
    img.onload = function () {
      const { naturalWidth: imgWidth, naturalHeight: imgHeight } = img
      const angle = rotation * (Math.PI / 180)

      const sine = Math.abs(Math.sin(angle))
      const cosine = Math.abs(Math.cos(angle))
      const squareWidth = imgWidth * cosine + imgHeight * sine
      const squareHeight = imgHeight * cosine + imgWidth * sine

      canvas.width = squareWidth
      canvas.height = squareHeight
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, squareWidth, squareHeight)

      const squareHalfWidth = squareWidth / 2
      const squareHalfHeight = squareHeight / 2
      ctx.translate(squareHalfWidth, squareHalfHeight)
      ctx.rotate(angle)
      ctx.translate(-squareHalfWidth, -squareHalfHeight)

      const imgX = (squareWidth - imgWidth) / 2
      const imgY = (squareHeight - imgHeight) / 2
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight, imgX, imgY, imgWidth, imgHeight)

      canvas2.width = Math.min(
        ((cropArea?.width ?? 100) / 100) * squareWidth,
        config.maxWidth ?? Number.POSITIVE_INFINITY,
      )
      canvas2.height = Math.min(
        ((cropArea?.height ?? 100) / 100) * squareHeight,
        config.maxHeight ?? Number.POSITIVE_INFINITY,
      )

      ctx2.drawImage(
        canvas,
        ((cropArea?.x ?? 0) / 100) * squareWidth,
        ((cropArea?.y ?? 0) / 100) * squareHeight,
        ((cropArea?.width ?? 100) / 100) * squareWidth,
        ((cropArea?.height ?? 100) / 100) * squareHeight,
        0,
        0,
        canvas2.width,
        canvas2.height,
      )

      canvas2.toBlob(blob => {
        if (!currentFile) {
          return
        }

        const newFile = new File([blob as BlobPart], currentFile.originalFile.name ?? "image.png", {
          type: currentFile.originalFile.type ?? "image/png",
        })

        const uploadFile: FileWithId = {
          originalFile: newFile,
          id: currentFile.id,
        }

        onAccept(uploadFile)
      })

      close()
    }
    img.src = modalImage
  }, [close, config, cropArea, currentFile, modalImage, rotation, onAccept])

  if (!config) return null

  return children({ zoom, rotation, setZoom, setRotation, accept, close })
}

export type CropperConfig = {
  aspect: number
  maxWidth?: number
  maxHeight?: number
  withRotation?: boolean
  withZoom?: boolean
}
