import { CSSProperties } from "react"
import EasyCrop from "react-easy-crop"
import { useUploadImagesContext } from "../Provider"

export type UploadImagesCropperEditorProps = {
  className?: string
  style?: CSSProperties
}

export function UploadImagesCropperEditor({ className, style }: UploadImagesCropperEditorProps) {
  const {
    cropper: { config, crop, modalImage, rotation, zoom, setCrop, setCropArea, setRotation, setZoom },
  } = useUploadImagesContext()

  if (!config) return null

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "300px",
        ...style,
      }}>
      <EasyCrop
        aspect={config.aspect}
        crop={crop}
        image={modalImage}
        rotation={rotation}
        zoom={zoom}
        onCropChange={setCrop}
        onCropComplete={setCropArea}
        onRotationChange={setRotation}
        onZoomChange={setZoom}
      />
    </div>
  )
}
