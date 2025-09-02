import { ReactNode } from "react"
import { useImageUploader } from "../_hooks/useImageUploader"
import { UploadImagesProvider } from "./Provider"

export interface UploadImagesRootProps {
  children: ReactNode
  uploader: ReturnType<typeof useImageUploader>
  className?: string
}

export function UploadImagesRoot({ children, className, uploader }: UploadImagesRootProps) {
  return (
    <UploadImagesProvider uploader={uploader}>
      <div className={className}>{children}</div>
    </UploadImagesProvider>
  )
}
