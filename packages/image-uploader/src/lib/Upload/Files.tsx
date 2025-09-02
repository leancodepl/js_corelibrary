import { ReactNode } from "react"
import { UploadFilesChildProps } from "../types"
import { useUploadContext } from "./Provider"

export interface UploadFilesProps {
  children: (props: UploadFilesChildProps) => ReactNode
  className?: string
}

export function UploadFiles({ children, className }: UploadFilesProps) {
  const { value } = useUploadContext()

  return <div className={className}>{children({ files: value })}</div>
}
