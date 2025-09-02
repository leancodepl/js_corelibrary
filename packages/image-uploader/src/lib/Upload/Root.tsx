import { ReactNode } from "react"
import { useImageUploader } from "../hooks/useImageUploader"

export interface UploadRootProps {
  children: ReactNode
  className?: string
  uploader: ReturnType<typeof useImageUploader>
}

export function UploadRoot({ children, className, uploader }: UploadRootProps) {
  return (
    <div className={className} data-upload-root="">
      {children}
    </div>
  )
}
