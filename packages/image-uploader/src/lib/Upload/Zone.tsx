import { ReactNode } from "react"
import { UploadZoneChildProps } from "../types"
import { useUploadContext } from "./Provider"

export interface UploadZoneProps {
  children: (props: UploadZoneChildProps) => ReactNode
  className?: string
}

export function UploadZone({ children, className }: UploadZoneProps) {
  const {
    dropzone: { getRootProps, getInputProps, isDragActive },
  } = useUploadContext()

  return (
    <div {...getRootProps()} className={className} data-upload-zone="">
      <input {...getInputProps()} />
      {children({ isDragActive })}
    </div>
  )
}
