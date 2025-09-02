import { ReactNode } from "react"
import { useImageUploader } from "../_hooks/useImageUploader"
import { UploadProvider } from "./Provider"

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
