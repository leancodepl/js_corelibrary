export type POEditorError =
  | { kind: "downloadTermsFailed"; cause: unknown }
  | { kind: "downloadTranslationsContentFailed"; language: string; url: string; cause: unknown }
  | { kind: "downloadTranslationsFailed"; language: string; cause: unknown }
  | { kind: "noDownloadUrl"; language: string }
  | { kind: "noReferenceLanguage" }
  | { kind: "removeTermsFailed"; cause: unknown }
  | { kind: "uploadTermsFailed"; cause: unknown }
  | { kind: "uploadTranslationsFailed"; language: string; cause: unknown }
  | { kind: "viewProjectFailed"; cause: unknown }

export type DownloadTranslationsError = Extract<
  POEditorError,
  { kind: "downloadTranslationsContentFailed" | "downloadTranslationsFailed" | "noDownloadUrl" }
>
export type UploadTermsError = Extract<POEditorError, { kind: "uploadTermsFailed" }>
export type UploadTranslationsError = Extract<POEditorError, { kind: "uploadTranslationsFailed" }>
export type DownloadTermsError = Extract<POEditorError, { kind: "downloadTermsFailed" }>
export type RemoveTermsError = Extract<POEditorError, { kind: "removeTermsFailed" }>
export type GetTranslationsInDefaultLanguageError =
  | DownloadTranslationsError
  | Extract<POEditorError, { kind: "noReferenceLanguage" | "viewProjectFailed" }>

const allKinds: readonly POEditorError["kind"][] = [
  "downloadTranslationsFailed",
  "downloadTranslationsContentFailed",
  "noDownloadUrl",
  "uploadTermsFailed",
  "uploadTranslationsFailed",
  "downloadTermsFailed",
  "removeTermsFailed",
  "viewProjectFailed",
  "noReferenceLanguage",
]

export function isPOEditorError(value: unknown): value is POEditorError {
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    return false
  }
  const { kind } = value as { kind: unknown }
  return typeof kind === "string" && (allKinds as readonly string[]).includes(kind)
}

export function formatPOEditorError(error: POEditorError): string {
  switch (error.kind) {
    case "downloadTranslationsFailed":
      return `Failed to download translations for ${error.language}: ${stringifyCause(error.cause)}`
    case "downloadTranslationsContentFailed":
      return `Failed to download translation content for ${error.language} from ${error.url}: ${stringifyCause(error.cause)}`
    case "noDownloadUrl":
      return `No download URL received from POEditor for language ${error.language}`
    case "uploadTermsFailed":
      return `Failed to upload terms: ${stringifyCause(error.cause)}`
    case "uploadTranslationsFailed":
      return `Failed to upload translations for ${error.language}: ${stringifyCause(error.cause)}`
    case "downloadTermsFailed":
      return `Failed to get terms: ${stringifyCause(error.cause)}`
    case "removeTermsFailed":
      return `Failed to remove terms: ${stringifyCause(error.cause)}`
    case "viewProjectFailed":
      return `Failed to view project: ${stringifyCause(error.cause)}`
    case "noReferenceLanguage":
      return "No reference language configured in POEditor project"
  }
}

export function stringifyCause(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}
