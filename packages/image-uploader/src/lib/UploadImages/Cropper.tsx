import { ReactNode, useCallback } from "react"
import { defaultCrop, defaultRotation, defaultZoom } from "../config"
import { FileWithId, UploadImagesCropperEditorChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export type UploadImagesCropperProps = {
  children: ((props: UploadImagesCropperEditorChildProps) => ReactNode) | ReactNode
}

export function UploadImagesCropper({ children }: UploadImagesCropperProps) {
  const {
    cropper: {
      file,
      editorImage,
      acceptImage,
      closeImage,
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
    closeImage()
    setCrop(defaultCrop)
    setZoom(defaultZoom)
    setRotation(defaultRotation)
    setCropArea(undefined)
  }, [closeImage, setCrop, setCropArea, setRotation, setZoom])

  const accept = useCallback(() => {
    if (!editorImage || !config) return

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
        if (!file) {
          return
        }

        const newFile = new File([blob as BlobPart], file.originalFile.name ?? "image.png", {
          type: file.originalFile.type ?? "image/png",
        })

        const uploadFile: FileWithId = {
          originalFile: newFile,
          id: file.id,
        }

        acceptImage(uploadFile)
      })

      close()
    }
    img.src = editorImage
  }, [close, config, cropArea, file, editorImage, rotation, acceptImage])

  if (!config) return null

  return typeof children === "function" ? children({ zoom, rotation, setZoom, setRotation, accept, close }) : children
}

export type CropperConfig = {
  aspect: number
  maxWidth?: number
  maxHeight?: number
  withRotation?: boolean
  withZoom?: boolean
}
