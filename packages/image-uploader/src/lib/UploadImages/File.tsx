import { HTMLAttributes, ReactNode, useEffect, useState } from "react"
import { getImagePreviewData } from "../_utils/getImagePreviewData"
import { FileWithId, UploadFileItemChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

/**
 * Props for individual file item component.
 */
export type UploadImagesFileItemProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ((props: UploadFileItemChildProps) => ReactNode) | ReactNode
  file: FileWithId
}

/**
 * Individual file item component with preview and removal functionality.
 *
 * Displays a single uploaded file with preview image generation and removal capability.
 * Automatically generates image preview data and provides remove function to children.
 *
 * @param children - Content or render function receiving file, preview, and remove function
 * @param file - File object with ID to display
 * @param props - Additional HTML div attributes
 * @returns JSX element for individual file with preview and controls
 *
 * @example
 * ```typescript
 * import { UploadImages } from "@leancodepl/image-uploader";
 *
 * <UploadImages.File file={fileWithId}>
 *   {({ file, preview, remove }) => (
 *     <div>
 *       <img src={preview} alt={file.originalFile.name} />
 *       <p>{file.originalFile.name}</p>
 *       <button onClick={remove}>Remove</button>
 *     </div>
 *   )}
 * </UploadImages.File>
 * ```
 */
export function UploadImagesFileItem({ children, file, ...props }: UploadImagesFileItemProps) {
  const { removeFile } = useUploadImagesContext()

  const [previewData, setPreviewData] = useState<string>()

  useEffect(() => {
    const loadPreview = async () => {
      const preview = await getImagePreviewData(file.originalFile)
      setPreviewData(preview)
    }

    loadPreview()
  }, [file.originalFile])

  return (
    <div {...props}>
      {typeof children === "function"
        ? children({ file, preview: previewData, remove: () => removeFile(file.id) })
        : children}
    </div>
  )
}
