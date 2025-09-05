import { HTMLAttributes } from "react"
import { useUploadImages } from "../_hooks/useUploadImages"
import { UploadImagesProvider } from "./Provider"

/**
 * Props for the UploadImages root component.
 */
export type UploadImagesRootProps = HTMLAttributes<HTMLDivElement> & {
  uploader: ReturnType<typeof useUploadImages>
}

/**
 * Root wrapper component for image upload functionality.
 *
 * Provides upload context to all child UploadImages components and renders a div container.
 * Must wrap all other UploadImages components to provide shared state.
 *
 * @param uploader - Upload state and functions from `useUploadImages` hook
 * @param props - Additional HTML div attributes
 * @returns JSX element wrapping children with upload context
 *
 * @example
 * ```typescript
 * import { UploadImages, useUploadImages } from "@leancodepl/image-uploader";
 *
 * const uploader = useUploadImages({ value: files, onChange: setFiles });
 *
 * <UploadImages.Root uploader={uploader}>
 *   <UploadImages.Zone>Drop files here</UploadImages.Zone>
 *   <UploadImages.Files />
 * </UploadImages.Root>
 * ```
 */
export function UploadImagesRoot({ uploader, ...props }: UploadImagesRootProps) {
  return (
    <UploadImagesProvider uploader={uploader}>
      <div {...props} />
    </UploadImagesProvider>
  )
}
