import { ReactNode } from "react"
import { useImageUploader } from "../_hooks/useImageUploader"
import { UploadProvider } from "./Provider"

export interface UploadRootProps {
  children: ReactNode
  uploader: ReturnType<typeof useImageUploader>
  className?: string
}

export function UploadRoot({ children, className, uploader }: UploadRootProps) {
  return (
    <UploadProvider uploader={uploader}>
      <div className={className}>{children}</div>
    </UploadProvider>
  )
}
