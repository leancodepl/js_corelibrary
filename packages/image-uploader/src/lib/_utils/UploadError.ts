export type UploadError =
  | { kind: "getUploadParamsFailed"; cause: unknown }
  | { kind: "imageNotDefined" }
  | { kind: "noUploadParams" }
  | { kind: "uploadRequestFailed"; cause: unknown }
  | { kind: "uploadResponseNotOk"; status: number; statusText: string }

export function formatUploadError(error: UploadError): string {
  switch (error.kind) {
    case "imageNotDefined":
      return "Image is not defined"
    case "getUploadParamsFailed":
      return `Failed to obtain upload params: ${stringifyCause(error.cause)}`
    case "noUploadParams":
      return "Upload params are not defined"
    case "uploadRequestFailed":
      return `Upload request failed: ${stringifyCause(error.cause)}`
    case "uploadResponseNotOk":
      return `Upload server responded with ${error.status} ${error.statusText}`
  }
}

function stringifyCause(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}
