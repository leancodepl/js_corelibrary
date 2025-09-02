import { ReactNode } from "react"
import { FileItemProps, UploadFile } from "../types"

export type FilesProps = {
  FileItem: (props: FileItemProps) => ReactNode
  onRemove: (id: string) => void
  files?: UploadFile[]
  filesClassName?: string
}

export function Files({ files, onRemove, FileItem, filesClassName }: FilesProps) {
  return (
    <div className={filesClassName}>
      {files?.map(file => (
        <FileItem key={file.id} file={file} remove={() => onRemove(file.id)} />
      ))}
    </div>
  )
}
