import { ReactNode, useCallback } from "react"
import { Accept, FileRejection, useDropzone } from "react-dropzone"
import { v4 as uuid } from "uuid"
import { ErrorCode, mapFileRejectionsToErrorCode } from "../_utils/errors"
import { FileWithId } from "../types"

type ZoneProps = {
  isDragActive: boolean
}

type DropzoneProps = {
  Zone: (props: ZoneProps) => ReactNode
  onDrop: (acceptedFiles: FileWithId[]) => void
  onError?: (errorCode: ErrorCode) => void
  accept?: Accept
}

export function Dropzone({ onDrop, onError, Zone, accept }: DropzoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles.map(file => ({ originalFile: file, id: uuid() })))
    },
    [onDrop],
  )

  const handleDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      onError?.(mapFileRejectionsToErrorCode(fileRejections))
    },
    [onError],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    accept,
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Zone isDragActive={isDragActive} />
    </div>
  )
}
