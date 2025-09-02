import { UploadFileItem } from "./File"
import { UploadFiles } from "./Files"
import { UploadRoot } from "./Root"
import { UploadZone } from "./Zone"

// Compound component with Radix-style dot notation
export const Upload = {
  Root: UploadRoot,
  Zone: UploadZone,
  Files: UploadFiles,
  File: UploadFileItem,
}

// Export individual components for flexibility
export { UploadFileItem, UploadFiles, UploadRoot, UploadZone }

// Export types
export type { UploadFileItemProps } from "./File"
export type { UploadFilesProps } from "./Files"
export type { UploadRootProps } from "./Root"
export type { UploadZoneProps } from "./Zone"
