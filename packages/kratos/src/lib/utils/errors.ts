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

export const getAuthErrorsFromUiTextList = (messages: UiText[] | undefined): AuthError[] => {
    return messages?.filter(isUiTextError).map(mapToAuthError) ?? []
}

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

    return Array.from(new Map(allErrors.map(error => [error.id, error])).values())
}

export enum AdditionalValidationError {
    FieldMismatch = "FieldMismatch",
    FieldRequired = "FieldRequired",
}

export const mapAdditionalValidationErrorToAuthError = (error: AdditionalValidationError) => {
    return {
        id: `AdditionalValidationError_${error}` as const,
    }
}

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
        case 4000001:
            // TODO add other specific variants
            if (hasProperetyOfType(error.context, "reason", "string")) {
                return createGenericErrorWithContext("InvalidFormat", {
                    reason: error.context.reason,
                })
            }
            return createGenericError("InvalidFormat")
        case 4000002:
            if (hasProperetyOfType(error.context, "property", "string")) {
                return createGenericErrorWithContext("MissingProperty", {
                    property: error.context.property,
                })
            }
            return createGenericError("MissingProperty")
        case 4000003:
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
        case 4000004:
            if (hasProperetyOfType(error.context, "pattern", "string")) {
                return createGenericErrorWithContext("InvalidPattern", {
                    pattern: error.context.pattern,
                })
            }
            return createGenericError("InvalidPattern")
        case 4000005:
            if (hasProperetyOfType(error.context, "reason", "string")) {
                return createGenericErrorWithContext("PasswordPolicyViolation", {
                    reason: error.context.reason,
                })
            }
            return createGenericError("PasswordPolicyViolation")
        case 4000006:
            return createGenericError("InvalidCredentials")
        case 4000007:
            return createGenericError("DuplicateCredentials")
        case 4000008:
            return createGenericError("TOTPVerifierWrong")
        case 4000009:
            return createGenericError("IdentifierMissing")
        case 4000010:
            return createGenericError("AddressNotVerified")
        case 4000011:
            return createGenericError("NoTOTPDeviceSetUp")
        case 4000012:
            return createGenericError("RecoveryCodeAlreadyUsed")
        case 4000013:
            return createGenericError("NoWebAuthnDeviceSetUp")
        case 4000014:
            return createGenericError("NoRecoveryCodesSetUp")
        case 4000015:
            return createGenericError("AccountNotExistsOrHasSecurityKey")
        case 4000016:
            return createGenericError("InvalidRecoveryCode")
        case 4000017:
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
        case 4000018:
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
        case 4000019:
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
        case 4000020:
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
        case 4000021:
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
        case 4000022:
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
        case 4000023:
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
        case 4000024:
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
        case 4000025:
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
        case 4000026:
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
        case 4000027:
            return createGenericError("AccountAlreadyExists")
        case 4000028:
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
        case 4000029:
            if (hasProperetyOfType(error.context, "expected", "string")) {
                return createGenericErrorWithContext("MustBeEqualTo", {
                    expected: error.context.expected,
                })
            }
            return createGenericError("MustBeEqualTo")
        case 4000030:
            return createGenericError("ConstFailed")
        case 4000031:
            return createGenericError("PasswordAndIdentifierTooSimilar")
        case 4000032:
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
        case 4000033:
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
        case 4000034:
            if (hasProperetyOfType(error.context, "breaches", "number")) {
                return createGenericErrorWithContext("PasswordLeaked", {
                    breaches: error.context.breaches,
                })
            }
            return createGenericError("PasswordLeaked")
        case 4000035:
            return createGenericError("AccountNotExistsOrWithoutCodeSignIn")
        case 4000036:
            return createGenericError("TraitsDoNotMatch")
        case 4000037:
            return createGenericError("AccountNotExistsOrWithoutLoginMethod")
        case 4000038:
            return createGenericError("CaptchaFailed")

        // Login Flow Errors
        case 4010001:
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
        case 4010002:
            return createLoginFlowError("NoLogInStrategyFound")
        case 4010003:
            return createLoginFlowError("NoSignUpStrategyFound")
        case 4010004:
            return createLoginFlowError("NoSettingsStrategyFound")
        case 4010005:
            return createLoginFlowError("NoRecoveryStrategyFound")
        case 4010006:
            return createLoginFlowError("NoVerificationStrategyFound")
        case 4010007:
            return createLoginFlowError("LoginRequestAlreadyCompletedSuccessfully")
        case 4010008:
            return createLoginFlowError("InvalidLoginCodeOrAlreadyUsed")
        case 4010009:
            return createLoginFlowError("MismatchedLinkedCretentials")
        case 4010010:
            return createLoginFlowError("MismatchedAddress")

        // Registration Flow Errors
        case 4040001:
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
        case 4040002:
            return createRegisterFlowError("RegisterRequestAlreadyCompletedSuccessfully")
        case 4040003:
            return createRegisterFlowError("InvalidRegisterCodeOrAlreadyUsed")

        // Settings Flow Errors
        case 4050001:
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
        case 4060001:
            return createRecoveryFlowError("RecoveryRequestAlreadyCompletedSuccessfully")
        case 4060002:
            return createRecoveryFlowError("RecoveryFlowFailureState")
        // case 4060003: NO INFO IN DOCS
        case 4060004:
            return createRecoveryFlowError("InvalidTokenOrAlreadyUsed")
        case 4060005:
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
        case 4060006:
            return createRecoveryFlowError("InvalidRecoveryCodeOrAlreadyUsed")

        // Verification Flow Errors
        case 4070001:
            return createVerificationFlowError("InvalidVerificationTokenOrAlreadyUsed")
        case 4070002:
            return createVerificationFlowError("VerificationRequestAlreadyCompletedSuccessfully")
        case 4070003:
            return createVerificationFlowError("VerificationFlowFailureState")
        // case 4070004: NO INFO IN DOCS
        case 4070005:
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
        case 4070006:
            return createVerificationFlowError("InvalidVerificationCodeOrAlreadyUsed")

        // Other Errors
        case 5000001:
        default:
            if (hasProperetyOfType(error.context, "reason", "string")) {
                return createGenericErrorWithContext("Generic", {
                    reason: error.context.reason,
                })
            }
            return createGenericError("Generic")
    }
}
