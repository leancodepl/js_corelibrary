import { ReactNode } from "react"
import { useImageUploader } from "../hooks/useImageUploader"
import { FileWithId } from "../types"

export interface UploadFilesProps {
  children: ((props: { files?: FileWithId[]; removeFile: (id: string) => void }) => ReactNode) | ReactNode
  className?: string
  uploader: ReturnType<typeof useImageUploader>
}

export function UploadFiles({ children, className, uploader }: UploadFilesProps) {
  const { value, removeFile } = uploader

  return (
    <div className={className} data-upload-files="">
      {typeof children === "function" ? children({ files: value, removeFile }) : children}
    </div>
  )
}
