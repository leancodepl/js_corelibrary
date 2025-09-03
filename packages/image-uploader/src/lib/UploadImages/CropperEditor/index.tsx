import EasyCrop from "react-easy-crop"
import { useUploadImagesContext } from "../Provider"
import styles from "./styles.module.scss"

export function UploadImagesCropperEditor() {
  const {
    cropper: { config, crop, modalImage, rotation, zoom, setCrop, setCropArea, setRotation, setZoom },
  } = useUploadImagesContext()

  if (!config) return null

  return (
    <div className={styles.CropperEditor}>
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
