import { HTMLAttributes, ReactNode } from "react"
import { UploadFilesChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

/**
 * Props for the UploadImages files container component.
 */
export type UploadImagesFilesProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ((props: UploadFilesChildProps) => ReactNode) | ReactNode
}

/**
 * Container component for displaying uploaded files.
 *
 * Renders a container for uploaded files and provides current file list to children.
 * Used to display and manage the collection of uploaded images.
 *
 * @param children - Content or render function receiving files array
 * @param props - Additional HTML div attributes
 * @returns JSX element containing uploaded files
 *
 * @example
 * ```typescript
 * import { UploadImages } from "@leancodepl/image-uploader";
 *
 * <UploadImages.Files>
 *   {({ files }) => (
 *     <div>
 *       {files?.map(file => (
 *         <UploadImages.File key={file.id} file={file}>
 *           {({ preview, remove }) => (
 *             <div>
 *               <img src={preview} alt="Preview" />
 *               <button onClick={remove}>Remove</button>
 *             </div>
 *           )}
 *         </UploadImages.File>
 *       ))}
 *     </div>
 *   )}
 * </UploadImages.Files>
 * ```
 */
export function UploadImagesFiles({ children, ...props }: UploadImagesFilesProps) {
  const { value } = useUploadImagesContext()

  return <div {...props}>{typeof children === "function" ? children({ files: value }) : children}</div>
}
