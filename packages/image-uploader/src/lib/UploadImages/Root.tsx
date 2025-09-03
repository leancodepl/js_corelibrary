import { HTMLAttributes, ReactNode } from "react"
import { useUploadImages } from "../_hooks/useUploadImages"
import { UploadImagesProvider } from "./Provider"

export type UploadImagesRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode
  uploader: ReturnType<typeof useUploadImages>
}

export function UploadImagesRoot({ children, uploader, ...props }: UploadImagesRootProps) {
  return (
    <UploadImagesProvider uploader={uploader}>
      <div {...props}>{children}</div>
    </UploadImagesProvider>
  )
}
