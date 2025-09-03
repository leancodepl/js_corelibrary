import { HTMLAttributes, ReactNode } from "react"
import { UploadFilesChildProps } from "../types"
import { useUploadImagesContext } from "./Provider"

export type UploadImagesFilesProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ((props: UploadFilesChildProps) => ReactNode) | ReactNode
}

export function UploadImagesFiles({ children, ...props }: UploadImagesFilesProps) {
  const { value } = useUploadImagesContext()

  return <div {...props}>{typeof children === "function" ? children({ files: value }) : children}</div>
}
