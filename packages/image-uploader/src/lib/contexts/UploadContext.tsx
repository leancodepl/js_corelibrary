import { createContext, ReactNode, useContext } from "react"
import { useImageUploader } from "../hooks/useImageUploader"

type UploadContextValue = ReturnType<typeof useImageUploader>

const UploadContext = createContext<UploadContextValue | undefined>(undefined)

export interface UploadProviderProps {
  children: ReactNode
  uploader: UploadContextValue
}

export function UploadProvider({ children, uploader }: UploadProviderProps) {
  return <UploadContext.Provider value={uploader}>{children}</UploadContext.Provider>
}

export function useUploadContext(): UploadContextValue {
  const context = useContext(UploadContext)
  if (!context) {
    throw new Error("All Upload components must be wrapped in an Upload.Root component")
  }
  return context
}
