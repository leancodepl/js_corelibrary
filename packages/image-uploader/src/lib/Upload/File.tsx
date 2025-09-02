import { ReactNode, useEffect, useState } from "react"
import { getImagePreviewData } from "../_utils/getImagePreviewData"
import { useUploadContext } from "../contexts/UploadContext"
import { FileWithId, UploadFileItemChildProps } from "../types"

export interface UploadFileItemProps {
  children: (props: UploadFileItemChildProps) => ReactNode
  className?: string
  file: FileWithId
}

export function UploadFileItem({ children, className, file }: UploadFileItemProps) {
  const { removeFile } = useUploadContext()

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
