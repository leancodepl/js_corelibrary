import { ReactNode } from "react"
import { UploadFilesChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export interface UploadImagesFilesProps {
  children: ((props: UploadFilesChildProps) => ReactNode) | ReactNode
  className?: string
}

export function UploadImagesFiles({ children, className }: UploadImagesFilesProps) {
  const { value } = useUploadImagesContext()

  return <div className={className}>{typeof children === "function" ? children({ files: value }) : children}</div>
}
