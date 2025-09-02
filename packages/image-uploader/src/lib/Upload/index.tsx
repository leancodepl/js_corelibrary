import { UploadFileItem } from "./File"
import { UploadFiles } from "./Files"
import { UploadRoot } from "./Root"
import { UploadZone } from "./Zone"

export const Upload = {
  Root: UploadRoot,
  Zone: UploadZone,
  Files: UploadFiles,
  File: UploadFileItem,
}

export type { UploadFileItemProps } from "./File"
export type { UploadFilesProps } from "./Files"
export type { UploadRootProps } from "./Root"
export type { UploadZoneProps } from "./Zone"
