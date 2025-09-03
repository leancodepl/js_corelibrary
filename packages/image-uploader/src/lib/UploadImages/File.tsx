import { HTMLAttributes, ReactNode, useEffect, useState } from "react"
import { getImagePreviewData } from "../_utils/getImagePreviewData"
import { FileWithId, UploadFileItemChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export type UploadImagesFileItemProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ((props: UploadFileItemChildProps) => ReactNode) | ReactNode
  file: FileWithId
}

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
