import { ReactNode } from "react"
import { UploadZoneChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export type UploadImagesZoneProps = {
  children: ((props: UploadZoneChildProps) => ReactNode) | ReactNode
  className?: string
}

export function UploadImagesZone({ children, className }: UploadImagesZoneProps) {
  const {
    dropzone: { getRootProps, getInputProps, isDragActive, isFocused, isFileDialogActive },
  } = useUploadImagesContext()

  return (
    <div {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      {typeof children === "function" ? children({ isDragActive, isFocused, isFileDialogActive }) : children}
    </div>
  )
}
