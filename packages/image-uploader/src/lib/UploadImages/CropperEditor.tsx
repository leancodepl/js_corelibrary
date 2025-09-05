import { HTMLAttributes } from "react"
import EasyCrop from "react-easy-crop"
import { useUploadImagesContext } from "./Provider"

/**
 * Props for the cropper editor visual component.
 */
export type UploadImagesCropperEditorProps = Omit<HTMLAttributes<HTMLDivElement>, "children">

/**
 * Visual editor component for image cropping.
 *
 * Renders the interactive crop editor interface using `"react-easy-crop"`.
 * Provides visual feedback for crop area, zoom, and rotation adjustments.
 *
 * @param style - CSS style object, merged with default positioning styles
 * @param props - Additional HTML div attributes
 * @returns JSX element with interactive crop editor
 * @throws {Error} When cropper config is not defined in context
 *
 * @example
 * ```typescript
 * import { UploadImages } from "@leancodepl/image-uploader";
 *
 * <UploadImages.Cropper>
 *   {({ zoom, setZoom, rotation, setRotation, accept, close }) => (
 *     <div>
 *       <UploadImages.CropperEditor />
 *       <div>
 *         <label>Zoom: <input type="range" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} /></label>
 *         <button onClick={accept}>Accept</button>
 *         <button onClick={close}>Cancel</button>
 *       </div>
 *     </div>
 *   )}
 * </UploadImages.Cropper>
 * ```
 */
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
