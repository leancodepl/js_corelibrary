import { ReactNode } from "react"
import { useUploadContext } from "../contexts/UploadContext"
import { UploadFilesChildProps } from "../types"

export interface UploadFilesProps {
  children: (props: UploadFilesChildProps) => ReactNode
  className?: string
}

export function UploadFiles({ children, className }: UploadFilesProps) {
  const { value } = useUploadContext()

  return (
    <div className={className} data-upload-files="">
      {children({ files: value })}
    </div>
  )
}
