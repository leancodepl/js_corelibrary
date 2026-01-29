import { instanceOfUiText, UiText, UiTextTypeEnum } from "../kratos"
import { hasProperetyOfType } from "./assertion"

export type UiTextError = UiText & {
  type: typeof UiTextTypeEnum.Error
}

export type AuthError = ReturnType<typeof mapAdditionalValidationErrorToAuthError> | ReturnType<typeof mapToAuthError>

export const isUiTextError = (error: unknown): error is UiTextError => {
  if (typeof error !== "object" || error === null) {
    return false
  }
  if (!instanceOfUiText(error)) {
    return false
  }
  if (error.type !== UiTextTypeEnum.Error) {
    return false
  }
  return true
}

export const isAuthError = (error: unknown): error is AuthError => {
  if (typeof error !== "object" || error === null) {
    return false
  }
  if (!("id" in error)) {
    return false
  }
  if (typeof error.id !== "string") {
    return false
  }
  if ("context" in error && (typeof error.context !== "object" || error.context === null)) {
    return false
  }
  if ("originalError" in error && !isUiTextError(error.originalError)) {
    return false
  }
  return true
}

export const getAuthErrorsFromUiTextList = (messages: UiText[] | undefined): AuthError[] =>
  messages?.filter(isUiTextError).map(mapToAuthError) ?? []

export const getAuthErrorsFromFormErrorMap = ({
  onSubmit: errors,
  onChange: errorsOnChange,
  onBlur: errorsOnBlur,
}: { onSubmit?: unknown; onChange?: unknown; onBlur?: unknown } = {}): Array<AuthError> => {
  const allErrors = [
    ...(Array.isArray(errors) ? errors : []),
    ...(Array.isArray(errorsOnChange) ? errorsOnChange : []),
    ...(Array.isArray(errorsOnBlur) ? errorsOnBlur : []),
  ].filter(isAuthError)

  return [...new Map(allErrors.map(error => [error.id, error])).values()]
}

export enum AdditionalValidationError {
  FieldMismatch = "FieldMismatch",
  FieldRequired = "FieldRequired",
}

export const mapAdditionalValidationErrorToAuthError = (error: AdditionalValidationError) => ({
  id: `AdditionalValidationError_${error}` as const,
})

const getErrorMappers = (error: UiTextError) => {
  type ErrorPrefix =
    | "Error"
    | "LoginFlowError"
    | "RecoveryFlowError"
    | "RegisterFlowError"
    | "SettingsFlowError"
    | "VerificationFlowError"

  const createError = <TPrefix extends ErrorPrefix, TId extends string>(prefix: TPrefix, id: TId) => ({
    id: `${prefix}_${id}` as const,
    originalError: error,
  })
  const createErrorWithContext = <
    TPrefix extends ErrorPrefix,
    TId extends string,
    TContext extends Record<string, unknown>,
  >(
    prefix: TPrefix,
    id: TId,
    context: TContext,
  ) => ({
    id: `${prefix}_${id}_WithContext` as const,
    context,
    originalError: error,
  })

  const createGenericError = <TId extends string>(id: TId) => createError("Error", id)
  const createGenericErrorWithContext = <TId extends string, TContext extends Record<string, unknown>>(
    id: TId,
    context: TContext,
  ) => createErrorWithContext("Error", id, context)

  const createLoginFlowError = <TId extends string>(id: TId) => createError("LoginFlowError", id)
  const createLoginFlowErrorWithContext = <TId extends string, TContext extends Record<string, unknown>>(
    id: TId,
    context: TContext,
  ) => createErrorWithContext("LoginFlowError", id, context)

  const createRegisterFlowError = <TId extends string>(id: TId) => createError("RegisterFlowError", id)
  const createRegisterFlowErrorWithContext = <TId extends string, TContext extends Record<string, unknown>>(
    id: TId,
    context: TContext,
  ) => createErrorWithContext("RegisterFlowError", id, context)

  const createSettingsFlowError = <TId extends string>(id: TId) => createError("SettingsFlowError", id)
  const createSettingsFlowErrorWithContext = <TId extends string, TContext extends Record<string, unknown>>(
    id: TId,
    context: TContext,
  ) => createErrorWithContext("SettingsFlowError", id, context)

  const createRecoveryFlowError = <TId extends string>(id: TId) => createError("RecoveryFlowError", id)
  const createRecoveryFlowErrorWithContext = <TId extends string, TContext extends Record<string, unknown>>(
    id: TId,
    context: TContext,
  ) => createErrorWithContext("RecoveryFlowError", id, context)

  const createVerificationFlowError = <TId extends string>(id: TId) => createError("VerificationFlowError", id)
  const createVerificationFlowErrorWithContext = <TId extends string, TContext extends Record<string, unknown>>(
    id: TId,
    context: TContext,
  ) => createErrorWithContext("VerificationFlowError", id, context)

  return {
    createGenericError,
    createGenericErrorWithContext,
    createLoginFlowError,
    createLoginFlowErrorWithContext,
    createRegisterFlowError,
    createRegisterFlowErrorWithContext,
    createSettingsFlowError,
    createSettingsFlowErrorWithContext,
    createRecoveryFlowError,
    createRecoveryFlowErrorWithContext,
    createVerificationFlowError,
    createVerificationFlowErrorWithContext,
  }
}

// Based on the error codes from Kratos https://github.com/ory/docs/blob/master/docs/kratos/concepts/messages.json
// Mapped from this specific file version
// https://github.com/ory/docs/blob/cc1ca22820f054aa2ba1c771601b36c5437e7f36/docs/kratos/concepts/messages.json
export const mapToAuthError = (error: UiTextError) => {
  const {
    createGenericError,
    createGenericErrorWithContext,
    createLoginFlowError,
    createLoginFlowErrorWithContext,
    createRegisterFlowError,
    createRegisterFlowErrorWithContext,
    createSettingsFlowError,
    createSettingsFlowErrorWithContext,
    createRecoveryFlowError,
    createRecoveryFlowErrorWithContext,
    createVerificationFlowError,
    createVerificationFlowErrorWithContext,
  } = getErrorMappers(error)

  switch (error.id) {
    case 4_000_001:
      // TODO add other specific variants
      if (hasProperetyOfType(error.context, "reason", "string")) {
        return createGenericErrorWithContext("InvalidFormat", {
          reason: error.context.reason,
        })
      }
      return createGenericError("InvalidFormat")
    case 4_000_002:
      if (hasProperetyOfType(error.context, "property", "string")) {
        return createGenericErrorWithContext("MissingProperty", {
          property: error.context.property,
        })
      }
      return createGenericError("MissingProperty")
    case 4_000_003:
      if (
        hasProperetyOfType(error.context, "min_length", "number") &&
        hasProperetyOfType(error.context, "actual_length", "number")
      ) {
        return createGenericErrorWithContext("TooShort", {
          min_length: error.context.min_length,
          actual_length: error.context.actual_length,
        })
      }
      return createGenericError("TooShort")
    case 4_000_004:
      if (hasProperetyOfType(error.context, "pattern", "string")) {
        return createGenericErrorWithContext("InvalidPattern", {
          pattern: error.context.pattern,
        })
      }
      return createGenericError("InvalidPattern")
    case 4_000_005:
      if (hasProperetyOfType(error.context, "reason", "string")) {
        return createGenericErrorWithContext("PasswordPolicyViolation", {
          reason: error.context.reason,
        })
      }
      return createGenericError("PasswordPolicyViolation")
    case 4_000_006:
      return createGenericError("InvalidCredentials")
    case 4_000_007:
      return createGenericError("DuplicateCredentials")
    case 4_000_008:
      return createGenericError("TOTPVerifierWrong")
    case 4_000_009:
      return createGenericError("IdentifierMissing")
    case 4_000_010:
      return createGenericError("AddressNotVerified")
    case 4_000_011:
      return createGenericError("NoTOTPDeviceSetUp")
    case 4_000_012:
      return createGenericError("RecoveryCodeAlreadyUsed")
    case 4_000_013:
      return createGenericError("NoWebAuthnDeviceSetUp")
    case 4_000_014:
      return createGenericError("NoRecoveryCodesSetUp")
    case 4_000_015:
      return createGenericError("AccountNotExistsOrHasSecurityKey")
    case 4_000_016:
      return createGenericError("InvalidRecoveryCode")
    case 4_000_017:
      if (
        hasProperetyOfType(error.context, "max_length", "number") &&
        hasProperetyOfType(error.context, "actual_length", "number")
      ) {
        return createGenericErrorWithContext("TooLong", {
          max_length: error.context.max_length,
          actual_length: error.context.actual_length,
        })
      }
      return createGenericError("TooLong")
    case 4_000_018:
      if (
        hasProperetyOfType(error.context, "actual", "number") &&
        hasProperetyOfType(error.context, "minimum", "number")
      ) {
        return createGenericErrorWithContext("MustBeGreaterOrEqualThan", {
          actual: error.context.actual,
          minimum: error.context.minimum,
        })
      }
      return createGenericError("MustBeGreaterOrEqualThan")
    case 4_000_019:
      if (
        hasProperetyOfType(error.context, "actual", "number") &&
        hasProperetyOfType(error.context, "minimum", "number")
      ) {
        return createGenericErrorWithContext("MustBeGreaterThan", {
          actual: error.context.actual,
          minimum: error.context.minimum,
        })
      }
      return createGenericError("MustBeGreaterThan")
    case 4_000_020:
      if (
        hasProperetyOfType(error.context, "actual", "number") &&
        hasProperetyOfType(error.context, "maximum", "number")
      ) {
        return createGenericErrorWithContext("MustBeLessOrEqualThan", {
          actual: error.context.actual,
          maximum: error.context.maximum,
        })
      }
      return createGenericError("MustBeLessOrEqualThan")
    case 4_000_021:
      if (
        hasProperetyOfType(error.context, "actual", "number") &&
        hasProperetyOfType(error.context, "maximum", "number")
      ) {
        return createGenericErrorWithContext("MustBeLessThan", {
          actual: error.context.actual,
          maximum: error.context.maximum,
        })
      }
      return createGenericError("MustBeLessThan")
    case 4_000_022:
      if (
        hasProperetyOfType(error.context, "actual", "number") &&
        hasProperetyOfType(error.context, "base", "number")
      ) {
        return createGenericErrorWithContext("IsNotMultipleOf", {
          actual: error.context.actual,
          base: error.context.base,
        })
      }
      return createGenericError("IsNotMultipleOf")
    case 4_000_023:
      if (
        hasProperetyOfType(error.context, "max_items", "number") &&
        hasProperetyOfType(error.context, "actual_items", "number")
      ) {
        return createGenericErrorWithContext("TooManyItems", {
          max_items: error.context.max_items,
          actual_items: error.context.actual_items,
        })
      }
      return createGenericError("TooManyItems")
    case 4_000_024:
      if (
        hasProperetyOfType(error.context, "min_items", "number") &&
        hasProperetyOfType(error.context, "actual_items", "number")
      ) {
        return createGenericErrorWithContext("TooFewItems", {
          min_items: error.context.min_items,
          actual_items: error.context.actual_items,
        })
      }
      return createGenericError("TooFewItems")
    case 4_000_025:
      if (
        hasProperetyOfType(error.context, "index_a", "number") &&
        hasProperetyOfType(error.context, "index_b", "number")
      ) {
        return createGenericErrorWithContext("DuplicateItems", {
          index_a: error.context.index_a,
          index_b: error.context.index_b,
        })
      }
      return createGenericError("DuplicateItems")
    case 4_000_026:
      if (
        hasProperetyOfType(error.context, "actual_type", "string") &&
        hasProperetyOfType(error.context, "allowed_types", "object") &&
        Array.isArray(error.context.allowed_types) &&
        error.context.allowed_types.every(type => typeof type === "string")
      ) {
        return createGenericErrorWithContext("InvalidType", {
          actual_type: error.context.actual_type,
          allowed_types: error.context.allowed_types,
        })
      }
      return createGenericError("InvalidType")
    case 4_000_027:
      return createGenericError("AccountAlreadyExists")
    case 4_000_028:
      if (
        hasProperetyOfType(error.context, "credential_identifier_hint", "string") &&
        hasProperetyOfType(error.context, "available_credential_types", "object") &&
        Array.isArray(error.context.available_credential_types) &&
        error.context.available_credential_types.every(type => typeof type === "string") &&
        hasProperetyOfType(error.context, "available_oidc_providers", "object") &&
        Array.isArray(error.context.available_oidc_providers) &&
        error.context.available_oidc_providers.every(type => typeof type === "string")
      ) {
        return createGenericErrorWithContext("CredentialIdentifierHintAlreadyUsedByOtherAccount", {
          available_credential_types: error.context.available_credential_types,
          available_oidc_providers: error.context.available_oidc_providers,
          credential_identifier_hint: error.context.credential_identifier_hint,
        })
      }
      return createGenericError("CredentialIdentifierHintAlreadyUsedByOtherAccount")
    case 4_000_029:
      if (hasProperetyOfType(error.context, "expected", "string")) {
        return createGenericErrorWithContext("MustBeEqualTo", {
          expected: error.context.expected,
        })
      }
      return createGenericError("MustBeEqualTo")
    case 4_000_030:
      return createGenericError("ConstFailed")
    case 4_000_031:
      return createGenericError("PasswordAndIdentifierTooSimilar")
    case 4_000_032:
      if (
        hasProperetyOfType(error.context, "min_length", "number") &&
        hasProperetyOfType(error.context, "actual_length", "number")
      ) {
        return createGenericErrorWithContext("PasswordTooShort", {
          min_length: error.context.min_length,
          actual_length: error.context.actual_length,
        })
      }
      return createGenericError("PasswordTooShort")
    case 4_000_033:
      if (
        hasProperetyOfType(error.context, "max_length", "number") &&
        hasProperetyOfType(error.context, "actual_length", "number")
      ) {
        return createGenericErrorWithContext("PasswordTooLong", {
          max_length: error.context.max_length,
          actual_length: error.context.actual_length,
        })
      }
      return createGenericError("PasswordTooLong")
    case 4_000_034:
      if (hasProperetyOfType(error.context, "breaches", "number")) {
        return createGenericErrorWithContext("PasswordLeaked", {
          breaches: error.context.breaches,
        })
      }
      return createGenericError("PasswordLeaked")
    case 4_000_035:
      return createGenericError("AccountNotExistsOrWithoutCodeSignIn")
    case 4_000_036:
      return createGenericError("TraitsDoNotMatch")
    case 4_000_037:
      return createGenericError("AccountNotExistsOrWithoutLoginMethod")
    case 4_000_038:
      return createGenericError("CaptchaFailed")

    // Login Flow Errors
    case 4_010_001:
      if (
        hasProperetyOfType(error.context, "expired_at", "string") &&
        hasProperetyOfType(error.context, "expired_at_unix", "number")
      ) {
        return createLoginFlowErrorWithContext("LoginFlowExpired", {
          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
          expired_at_unix: error.context.expired_at_unix,
        })
      }
      return createLoginFlowError("LoginFlowExpired")
    case 4_010_002:
      return createLoginFlowError("NoLogInStrategyFound")
    case 4_010_003:
      return createLoginFlowError("NoSignUpStrategyFound")
    case 4_010_004:
      return createLoginFlowError("NoSettingsStrategyFound")
    case 4_010_005:
      return createLoginFlowError("NoRecoveryStrategyFound")
    case 4_010_006:
      return createLoginFlowError("NoVerificationStrategyFound")
    case 4_010_007:
      return createLoginFlowError("LoginRequestAlreadyCompletedSuccessfully")
    case 4_010_008:
      return createLoginFlowError("InvalidLoginCodeOrAlreadyUsed")
    case 4_010_009:
      return createLoginFlowError("MismatchedLinkedCretentials")
    case 4_010_010:
      return createLoginFlowError("MismatchedAddress")

    // Registration Flow Errors
    case 4_040_001:
      if (
        hasProperetyOfType(error.context, "expired_at", "string") &&
        hasProperetyOfType(error.context, "expired_at_unix", "number")
      ) {
        return createRegisterFlowErrorWithContext("RegisterFlowExpired", {
          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
          expired_at_unix: error.context.expired_at_unix,
        })
      }
      return createRegisterFlowError("RegisterFlowExpired")
    case 4_040_002:
      return createRegisterFlowError("RegisterRequestAlreadyCompletedSuccessfully")
    case 4_040_003:
      return createRegisterFlowError("InvalidRegisterCodeOrAlreadyUsed")

    // Settings Flow Errors
    case 4_050_001:
      if (
        hasProperetyOfType(error.context, "expired_at", "string") &&
        hasProperetyOfType(error.context, "expired_at_unix", "number")
      ) {
        return createSettingsFlowErrorWithContext("SettingsFlowExpired", {
          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
          expired_at_unix: error.context.expired_at_unix,
        })
      }
      return createSettingsFlowError("SettingsFlowExpired")

    // Recovery Flow Errors
    case 4_060_001:
      return createRecoveryFlowError("RecoveryRequestAlreadyCompletedSuccessfully")
    case 4_060_002:
      return createRecoveryFlowError("RecoveryFlowFailureState")
    // case 4_060_003: NO INFO IN DOCS
    case 4_060_004:
      return createRecoveryFlowError("InvalidTokenOrAlreadyUsed")
    case 4_060_005:
      if (
        hasProperetyOfType(error.context, "expired_at", "string") &&
        hasProperetyOfType(error.context, "expired_at_unix", "number")
      ) {
        return createRecoveryFlowErrorWithContext("RecoveryFlowExpired", {
          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
          expired_at_unix: error.context.expired_at_unix,
        })
      }
      return createRecoveryFlowError("RecoveryFlowExpired")
    case 4_060_006:
      return createRecoveryFlowError("InvalidRecoveryCodeOrAlreadyUsed")

    // Verification Flow Errors
    case 4_070_001:
      return createVerificationFlowError("InvalidVerificationTokenOrAlreadyUsed")
    case 4_070_002:
      return createVerificationFlowError("VerificationRequestAlreadyCompletedSuccessfully")
    case 4_070_003:
      return createVerificationFlowError("VerificationFlowFailureState")
    // case 4_070_004: NO INFO IN DOCS
    case 4_070_005:
      if (
        hasProperetyOfType(error.context, "expired_at", "string") &&
        hasProperetyOfType(error.context, "expired_at_unix", "number")
      ) {
        return createVerificationFlowErrorWithContext("VerificationFlowExpired", {
          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
          expired_at_unix: error.context.expired_at_unix,
        })
      }
      return createVerificationFlowError("VerificationFlowExpired")
    case 4_070_006:
      return createVerificationFlowError("InvalidVerificationCodeOrAlreadyUsed")

    // Other Errors including 5_000_001
    default:
      if (hasProperetyOfType(error.context, "reason", "string")) {
        return createGenericErrorWithContext("Generic", {
          reason: error.context.reason,
        })
      }
      return createGenericError("Generic")
  }
}
