import { ReactNode } from "react"
import { UploadZoneChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export interface UploadImagesZoneProps {
  children: (props: UploadZoneChildProps) => ReactNode
  className?: string
}

export function UploadImagesZone({ children, className }: UploadImagesZoneProps) {
  const {
    dropzone: { getRootProps, getInputProps, isDragActive, isFocused, isFileDialogActive },
  } = useUploadImagesContext()

  return (
    <div {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      {children({ isDragActive, isFocused, isFileDialogActive })}
    </div>
  )
}
