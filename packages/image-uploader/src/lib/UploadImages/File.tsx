import { ReactNode, useEffect, useState } from "react"
import { getImagePreviewData } from "../_utils/getImagePreviewData"
import { FileWithId, UploadFileItemChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export interface UploadImagesFileItemProps {
  children: (props: UploadFileItemChildProps) => ReactNode
  className?: string
  file: FileWithId
}

export function UploadImagesFileItem({ children, className, file }: UploadImagesFileItemProps) {
  const { removeFile } = useUploadImagesContext()

  const [previewData, setPreviewData] = useState<string>()

  useEffect(() => {
    const loadPreview = async () => {
      const preview = await getImagePreviewData(file)
      setPreviewData(preview)
    }

    loadPreview()
  }, [file])

  return <div className={className}>{children({ file, preview: previewData, remove: () => removeFile(file.id) })}</div>
}
