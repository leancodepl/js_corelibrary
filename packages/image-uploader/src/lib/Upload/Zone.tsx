import { ReactNode } from "react"
import { useImageUploader } from "../hooks/useImageUploader"

export interface UploadZoneProps {
  children: ((props: { isDragActive: boolean }) => ReactNode) | ReactNode
  className?: string
  uploader: ReturnType<typeof useImageUploader>
}

export function UploadZone({ children, className, uploader }: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = uploader.dropzone

  return (
    <div {...getRootProps()} className={className} data-upload-zone="">
      <input {...getInputProps()} />
      {typeof children === "function" ? children({ isDragActive }) : children}
    </div>
  )
}
