import { HTMLAttributes, ReactNode } from "react"
import { UploadZoneChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export type UploadImagesZoneProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ((props: UploadZoneChildProps) => ReactNode) | ReactNode
}

export function UploadImagesZone({ children, ...props }: UploadImagesZoneProps) {
  const {
    dropzone: { getRootProps, getInputProps, isDragActive, isFocused, isFileDialogActive },
  } = useUploadImagesContext()

  return (
    <div {...getRootProps()} {...props}>
      <input {...getInputProps()} />
      {typeof children === "function" ? children({ isDragActive, isFocused, isFileDialogActive }) : children}
    </div>
  )
}
