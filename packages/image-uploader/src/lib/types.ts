export type { Accept, FileRejection } from "react-dropzone"

export type FileWithId = {
  originalFile: File
  id: string
}

export type UploadedFileWithId = FileWithId & {
  url: string
}

export type UploadParams = {
  uri: string
  method: string
  requiredHeaders: Record<string, string>
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
  isFileDialogActive: boolean
  isFocused: boolean
}

export type UploadImagesCropperEditorChildProps = {
  zoom: number
  rotation: number
  setZoom: (zoom: number) => void
  setRotation: (rotation: number) => void
  accept: () => void
  close: () => void
}
