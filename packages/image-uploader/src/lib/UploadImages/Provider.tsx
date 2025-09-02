import { createContext, ReactNode, useContext } from "react"
import { useImageUploader } from "../_hooks/useImageUploader"

type UploadImagesContextValue = ReturnType<typeof useImageUploader>

const UploadImagesContext = createContext<UploadImagesContextValue | undefined>(undefined)

export interface UploadImagesProviderProps {
  children: ReactNode
  uploader: UploadImagesContextValue
}

export function UploadImagesProvider({ children, uploader }: UploadImagesProviderProps) {
  return <UploadImagesContext.Provider value={uploader}>{children}</UploadImagesContext.Provider>
}

export function useUploadImagesContext(): UploadImagesContextValue {
  const context = useContext(UploadImagesContext)
  if (!context) {
    throw new Error("All UploadImages components must be wrapped in an UploadImages.Root component")
  }
  return context
}
