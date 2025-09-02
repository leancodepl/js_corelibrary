import { HTMLAttributes, useEffect, useState } from "react"
import { getImagePreviewData } from "../_utils/getImagePreviewData"
import { FileWithId } from "../types"

export type ImagePreviewProps = Omit<HTMLAttributes<HTMLImageElement>, "alt" | "src"> & {
  file: FileWithId
  className?: string
}

export function ImagePreview({ file, className, ...props }: ImagePreviewProps) {
  const [previewData, setPreviewData] = useState<string>("")

  useEffect(() => {
    const loadPreview = async () => {
      const preview = await getImagePreviewData(file)
      setPreviewData(preview)
    }

    loadPreview()
  }, [file])

  return previewData && <img alt={file.originalFile.name} className={className} src={previewData} {...props} />
}
