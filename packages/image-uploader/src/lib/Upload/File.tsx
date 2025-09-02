import { ReactNode } from "react"
import { FileWithId } from "../types"

export interface UploadFileItemProps {
  children: ((props: { file: FileWithId; remove: () => void }) => ReactNode) | ReactNode
  className?: string
  file: FileWithId
  onRemove: () => void
}

export function UploadFileItem({ children, className, file, onRemove }: UploadFileItemProps) {
  return (
    <div className={className} data-upload-file="">
      {typeof children === "function" ? children({ file, remove: onRemove }) : children}
    </div>
  )
}
