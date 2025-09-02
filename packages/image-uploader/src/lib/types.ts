export type { Accept, FileRejection } from "react-dropzone"

export type FileWithId = {
  originalFile: File
  id: string
}

export type FileItemProps = {
  file: FileWithId
  remove: () => void
}

export type ZoneProps = {
  isDragActive: boolean
}
