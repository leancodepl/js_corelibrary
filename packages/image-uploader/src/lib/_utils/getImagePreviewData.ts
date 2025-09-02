import { FileWithId } from "../types"

export async function getImagePreviewData(file: FileWithId) {
  return file.originalFile ? await getBase64(file.originalFile) : ""
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = error => reject(error)
  })
