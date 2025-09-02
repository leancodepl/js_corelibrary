import { ReactNode } from "react"
import { useUploadImages } from "../_hooks/useUploadImages"
import { UploadImagesProvider } from "./Provider"

export interface UploadImagesRootProps {
  children: ReactNode
  uploader: ReturnType<typeof useUploadImages>
  className?: string
}

export function UploadImagesRoot({ children, className, uploader }: UploadImagesRootProps) {
  return (
    <UploadImagesProvider uploader={uploader}>
      <div className={className}>{children}</div>
    </UploadImagesProvider>
  )
}
