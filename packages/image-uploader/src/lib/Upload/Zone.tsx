import { ReactNode } from "react"
import { useUploadContext } from "../contexts/UploadContext"
import { UploadZoneChildProps } from "../types"

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
