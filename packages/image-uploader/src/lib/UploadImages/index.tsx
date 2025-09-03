import { UploadImagesCropper } from "./Cropper"
import { UploadImagesCropperEditor } from "./CropperEditor"
import { UploadImagesFileItem } from "./File"
import { UploadImagesFiles } from "./Files"
import { UploadImagesRoot } from "./Root"
import { UploadImagesZone } from "./Zone"

export const UploadImages = {
  Root: UploadImagesRoot,
  Zone: UploadImagesZone,
  Files: UploadImagesFiles,
  File: UploadImagesFileItem,
  Cropper: UploadImagesCropper,
  CropperEditor: UploadImagesCropperEditor,
}

export type { UploadImagesFileItemProps } from "./File"
export type { UploadImagesFilesProps } from "./Files"
export type { UploadImagesRootProps } from "./Root"
export type { UploadImagesZoneProps } from "./Zone"
export type { UploadImagesCropperProps } from "./Cropper"
export type { UploadImagesCropperEditorProps } from "./CropperEditor"
