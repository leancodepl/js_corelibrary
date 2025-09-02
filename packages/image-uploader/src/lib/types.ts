export type { FileRejection } from "react-dropzone"

export type UploadFile = {
  originalFile: File
  id: string
}

export type FileItemProps = {
  file: UploadFile
  remove: () => void
}

export type ZoneProps = {
  isDragActive: boolean
}
