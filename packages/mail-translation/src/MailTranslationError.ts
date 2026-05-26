export type MailTranslationError =
  | { kind: "configFileNotFound" }
  | { kind: "configValidationFailed"; cause: unknown }
  | { kind: "loadMjmlTemplatesFailed"; mailsPath: string; cause: unknown }
  | { kind: "loadPlaintextTemplatesFailed"; plaintextMailsPath: string; cause: unknown }
  | { kind: "mjmlCompilationFailed"; filePath: string; cause: unknown }

export type LoadConfigError = Extract<MailTranslationError, { kind: "configFileNotFound" | "configValidationFailed" }>
export type LoadMjmlTemplatesError = Extract<MailTranslationError, { kind: "loadMjmlTemplatesFailed" }>
export type LoadPlaintextTemplatesError = Extract<MailTranslationError, { kind: "loadPlaintextTemplatesFailed" }>
export type CompileMjmlError = Extract<MailTranslationError, { kind: "mjmlCompilationFailed" }>

export function formatMailTranslationError(error: MailTranslationError): string {
  switch (error.kind) {
    case "configFileNotFound":
      return "No mail-translation configuration file found"
    case "configValidationFailed":
      return `Failed to validate mail-translation configuration: ${stringifyCause(error.cause)}`
    case "loadMjmlTemplatesFailed":
      return `Failed to load MJML templates from ${error.mailsPath}: ${stringifyCause(error.cause)}`
    case "loadPlaintextTemplatesFailed":
      return `Failed to load plaintext templates from ${error.plaintextMailsPath}: ${stringifyCause(error.cause)}`
    case "mjmlCompilationFailed":
      return `MJML compilation failed for ${error.filePath}: ${stringifyCause(error.cause)}`
  }
}

export function stringifyCause(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}
