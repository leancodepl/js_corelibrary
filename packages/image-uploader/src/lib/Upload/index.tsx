import { ReactNode, useCallback } from "react"
import { Accept } from "react-dropzone"
import { ErrorCode } from "../_utils/errors"
import { isExactFile } from "../_utils/isExactFile"
import { defaultAccept } from "../config"
import { Dropzone } from "../Dropzone"
import { Files } from "../Files"
import { FileItemProps, UploadFile, ZoneProps } from "../types"

export type UploadProps = {
  FileItem: (props: FileItemProps) => ReactNode
  Zone: (props: ZoneProps) => ReactNode
  accept?: Accept
  value?: UploadFile[]
  className?: string
  filesClassName?: string
  onChange?: (files: UploadFile[]) => void
  onError?: (errorCode: ErrorCode) => void
}

export function Upload({
  value,
  onChange,
  onError,
  className,
  filesClassName,
  FileItem,
  Zone,
  accept = defaultAccept,
}: UploadProps) {
  const handleNewFiles = useCallback(
    (newFiles: UploadFile[]) => {
      const uniqueNewFiles = newFiles.filter(
        newFile => !value?.some(existingFile => isExactFile(existingFile.originalFile, newFile.originalFile)),
      )
      onChange?.(value ? [...value, ...uniqueNewFiles] : uniqueNewFiles)
    },
    [onChange, value],
  )

  const handleRemoveFile = useCallback(
    (id: string) => {
      onChange?.(value?.filter(f => f.id !== id) ?? [])
    },
    [value, onChange],
  )

  return (
    <div className={className}>
      <Dropzone accept={accept} Zone={Zone} onDrop={handleNewFiles} onError={onError} />
      <Files FileItem={FileItem} files={value} filesClassName={filesClassName} onRemove={handleRemoveFile} />
    </div>
  )
}
