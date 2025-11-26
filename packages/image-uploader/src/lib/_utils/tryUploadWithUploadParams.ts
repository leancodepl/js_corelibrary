import { FileWithId, UploadedFileWithId, UploadParams } from "../types"

/**
 * Uploads an image file using provided upload parameters.
 *
 * Handles file upload by calling the getUploadParams function to retrieve upload configuration,
 * then performs a fetch request to upload the file. Returns early if the image is already uploaded.
 *
 * @param image - Image file with ID or already uploaded image with URL
 * @param getUploadParams - Function that returns upload parameters (URI, method, headers) for the image
 * @returns Promise resolving to uploaded image with URL
 * @throws {Error} When upload params are not defined, image is not defined, or upload fails
 *
 * @example
 * ```typescript
 * import { tryUploadWithUploadParams } from "@leancodepl/image-uploader";
 *
 * const uploadedImage = await tryUploadWithUploadParams(image, async (img) => ({
 *   uri: "https://api.example.com/upload",
 *   method: "POST",
 *   requiredHeaders: { "Content-Type": "image/jpeg" }
 * }));
 * ```
 */
export async function tryUploadWithUploadParams(
  image: FileWithId | UploadedFileWithId,
  getUploadParams: (image: FileWithId) => Promise<null | undefined | UploadParams>,
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
