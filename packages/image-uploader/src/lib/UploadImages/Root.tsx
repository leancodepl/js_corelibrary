import { HTMLAttributes } from "react"
import { useUploadImages } from "../_hooks/useUploadImages"
import { UploadImagesProvider } from "./Provider"

export type UploadImagesRootProps = HTMLAttributes<HTMLDivElement> & {
  uploader: ReturnType<typeof useUploadImages>
}

export function UploadImagesRoot({ uploader, ...props }: UploadImagesRootProps) {
  return (
    <UploadImagesProvider uploader={uploader}>
      <div {...props} />
    </UploadImagesProvider>
  )
}
