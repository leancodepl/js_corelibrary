import { HTMLAttributes, ReactNode } from "react"
import { UploadZoneChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

/**
 * Props for the UploadImages zone component.
 */
export type UploadImagesZoneProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ((props: UploadZoneChildProps) => ReactNode) | ReactNode
}

/**
 * Drag-and-drop zone component for file uploads.
 *
 * Creates an interactive drop zone with file input capabilities. Supports both click-to-select
 * and drag-and-drop file uploads. Provides drag state to children for visual feedback.
 *
 * @param children - Content or render function receiving drag state props
 * @param props - Additional HTML div attributes
 * @returns JSX element with drag-and-drop upload functionality
 *
 * @example
 * ```typescript
 * import { UploadImages } from "@leancodepl/image-uploader";
 *
 * <UploadImages.Zone>
 *   {({ isDragActive, isFocused }) => (
 *     <div className={isDragActive ? "drag-active" : ""}>
 *       {isDragActive ? "Drop files here" : "Click or drag files to upload"}
 *     </div>
 *   )}
 * </UploadImages.Zone>
 * ```
 */
export function UploadImagesZone({ children, ...props }: UploadImagesZoneProps) {
  const {
    dropzone: { getRootProps, getInputProps, isDragActive, isFocused, isFileDialogActive },
  } = useUploadImagesContext()

  return (
    <div {...getRootProps()} {...props}>
      <input {...getInputProps()} />
      {typeof children === "function" ? children({ isDragActive, isFocused, isFileDialogActive }) : children}
    </div>
  )
}
