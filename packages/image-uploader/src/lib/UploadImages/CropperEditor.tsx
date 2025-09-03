import { HTMLAttributes } from "react"
import EasyCrop from "react-easy-crop"
import { useUploadImagesContext } from "./Provider"

export type UploadImagesCropperEditorProps = Omit<HTMLAttributes<HTMLDivElement>, "children">

export function UploadImagesCropperEditor({ style, ...props }: UploadImagesCropperEditorProps) {
  const { cropper } = useUploadImagesContext()

  if (!cropper) {
    throw new Error("Cropper config is not defined")
  }

  const { editorImage, config, zoom, rotation, crop, setCropArea, setCrop, setZoom, setRotation } = cropper

  return (
    <div
      {...props}
      style={{
        position: "relative",
        width: "100%",
        height: "300px",
        ...style,
      }}>
      <EasyCrop
        aspect={config.aspect}
        crop={crop}
        image={editorImage}
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
