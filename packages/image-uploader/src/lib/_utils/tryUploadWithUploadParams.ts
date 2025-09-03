import { FileWithId, UploadedFileWithId, UploadParams } from "../types"

export async function tryUploadWithUploadParams(
  image: FileWithId | UploadedFileWithId,
  getUploadParams: (image: FileWithId) => Promise<UploadParams | null | undefined>,
): Promise<UploadedFileWithId> {
  if ("url" in image) {
    return image
  }

  if (!image.originalFile) {
    throw new Error("Image is not defined")
  }

  try {
    const uploadParams = await getUploadParams(image)

    if (!uploadParams) {
      throw new Error("Upload params are not defined")
    }

    const { uri, method, requiredHeaders } = uploadParams

    const response = await fetch(uri, { method, headers: requiredHeaders, body: image.originalFile })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    return { ...image, url: uri }
  } catch {
    throw new Error("Failed to upload image")
  }
}
