export type { Accept, FileRejection } from "react-dropzone"

export type FileWithId = {
  originalFile: File
  id: string
}

export type UploadFilesChildProps = {
  files?: FileWithId[]
}

export type UploadFileItemChildProps = {
  file: FileWithId
  preview?: string
  remove: () => void
}

export type UploadZoneChildProps = {
  isDragActive: boolean
}
