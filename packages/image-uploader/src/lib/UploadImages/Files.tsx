import { ReactNode } from "react"
import { UploadFilesChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export interface UploadImagesFilesProps {
  children: (props: UploadFilesChildProps) => ReactNode
  className?: string
}

export function UploadImagesFiles({ children, className }: UploadImagesFilesProps) {
  const { value } = useUploadImagesContext()

  return <div className={className}>{children({ files: value })}</div>
}
