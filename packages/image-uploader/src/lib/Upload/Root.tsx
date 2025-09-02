import { ReactNode } from "react"
import { UploadProvider } from "../contexts/UploadContext"
import { useImageUploader } from "../hooks/useImageUploader"

export interface UploadRootProps {
  children: ReactNode
  className?: string
  uploader: ReturnType<typeof useImageUploader>
}

export function UploadRoot({ children, className, uploader }: UploadRootProps) {
  return (
    <UploadProvider uploader={uploader}>
      <div className={className} data-upload-root="">
        {children}
      </div>
    </UploadProvider>
  )
}
