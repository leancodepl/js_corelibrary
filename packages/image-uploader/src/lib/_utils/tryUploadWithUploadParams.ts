import { errAsync, okAsync, ResultAsync } from "neverthrow"
import { FileWithId, UploadedFileWithId, UploadParams } from "../types"
import { UploadError } from "./UploadError"

/**
 * Uploads an image file using provided upload parameters.
 *
 * Handles file upload by calling the getUploadParams function to retrieve upload configuration,
 * then performs a fetch request to upload the file. Returns early if the image is already uploaded.
 *
 * @param image - Image file with ID or already uploaded image with URL
 * @param getUploadParams - Function that returns upload parameters (URI, method, headers) for the image
 * @returns ResultAsync resolving to the uploaded image with URL, or a typed `UploadError` on failure
 *
 * @example
 * ```typescript
 * import { tryUploadWithUploadParams } from "@leancodepl/image-uploader";
 *
 * const result = await tryUploadWithUploadParams(image, async (img) => ({
 *   uri: "https://api.example.com/upload",
 *   method: "POST",
 *   requiredHeaders: { "Content-Type": "image/jpeg" }
 * }));
 *
 * if (result.isErr()) {
 *   // result.error is a typed UploadError; switch on result.error.kind
 * } else {
 *   const uploadedImage = result.value;
 * }
 * ```
 */
export function tryUploadWithUploadParams(
  image: FileWithId | UploadedFileWithId,
  getUploadParams: (image: FileWithId) => Promise<UploadParams | null | undefined>,
): ResultAsync<UploadedFileWithId, UploadError> {
  if ("url" in image) {
    return okAsync(image)
  }

  if (!image.originalFile) {
    return errAsync({ kind: "imageNotDefined" })
  }

  const fileImage = image

  return ResultAsync.fromPromise(
    getUploadParams(fileImage),
    (cause): UploadError => ({ kind: "getUploadParamsFailed", cause }),
  ).andThen(uploadParams => {
    if (!uploadParams) {
      return errAsync<UploadedFileWithId, UploadError>({ kind: "noUploadParams" })
    }
    const { uri, method, requiredHeaders } = uploadParams

    return ResultAsync.fromPromise(
      fetch(uri, { method, headers: requiredHeaders, body: fileImage.originalFile }),
      (cause): UploadError => ({ kind: "uploadRequestFailed", cause }),
    ).andThen(response => {
      if (!response.ok) {
        return errAsync<UploadedFileWithId, UploadError>({
          kind: "uploadResponseNotOk",
          status: response.status,
          statusText: response.statusText,
        })
      }
      return okAsync({ ...fileImage, url: uri })
    })
  })
}
