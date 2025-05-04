import { instanceOfUiText, UiText, UiTextTypeEnum } from "../kratos/models"

export type UiTextError = UiText & {
    type: typeof UiTextTypeEnum.Error
}

export type AuthError = ReturnType<typeof mapToAuthError>

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
    if (!("context" in error)) {
        return false
    }
    if (typeof error.context !== "object" || error.context === null) {
        return false
    }
    if (!("originalError" in error)) {
        return false
    }
    if (!isUiTextError(error.originalError)) {
        return false
    }
    return true
}

export const getAuthErrorsFromUiTextList = (messages: UiText[] | undefined): Array<AuthError> => {
    return messages?.filter(isUiTextError).map(mapToAuthError) ?? []
}

export const getAuthErrorsFromFormErrorMap = ({ onSubmit: errors }: { onSubmit?: unknown } = {}): Array<AuthError> => {
    if (!errors || !Array.isArray(errors) || errors.length === 0) {
        return []
    }

    return errors.filter(isAuthError)
}

// Based on the error codes from Kratos https://github.com/ory/docs/blob/master/docs/kratos/concepts/messages.json
// Mapped from this specific file version
// https://github.com/ory/docs/blob/cc1ca22820f054aa2ba1c771601b36c5437e7f36/docs/kratos/concepts/messages.json
export const mapToAuthError = (error: UiTextError) => {
    const createError = <TPrefix extends string, TId extends string, TContext = undefined>(
        prefix: TPrefix,
        id: TId,
        context?: TContext,
    ) => ({
        id: `${prefix}_${id}` as `${TPrefix}_${TId}`,
        context,
        originalError: error,
    })

    const createGenericError = <TId extends string, TContext = undefined>(id: TId, context?: TContext) =>
        createError("Error", id, context)

    const createLoginFlowError = <TId extends string, TContext = undefined>(id: TId, context?: TContext) =>
        createError("LoginFlowError", id, context)

    const createRegisterFlowError = <TId extends string, TContext = undefined>(id: TId, context?: TContext) =>
        createError("RegisterFlowError", id, context)

    const createSettingsFlowError = <TId extends string, TContext = undefined>(id: TId, context?: TContext) =>
        createError("SettingsFlowError", id, context)

    const createRecoveryFlowError = <TId extends string, TContext = undefined>(id: TId, context?: TContext) =>
        createError("RecoveryFlowError", id, context)

    const createVerificationFlowError = <TId extends string, TContext = undefined>(id: TId, context?: TContext) =>
        createError("VerificationFlowError", id, context)

    switch (error.id) {
        case 4000001:
            // TODO add other specific variants
            return createGenericError(
                "GenericInvalidFormat",
                error.context && "reason" in error.context && typeof error.context.reason === "string"
                    ? {
                          reason: error.context.reason,
                      }
                    : undefined,
            )
        case 4000002:
            return createGenericError(
                "MissingProperty",
                error.context && "property" in error.context && typeof error.context.property === "string"
                    ? {
                          property: error.context.property,
                      }
                    : undefined,
            )
        case 4000003:
            return createGenericError(
                "TooShort",
                error.context &&
                    "min_length" in error.context &&
                    typeof error.context.min_length === "number" &&
                    "actual_length" in error.context &&
                    typeof error.context.actual_length === "number"
                    ? {
                          min_length: error.context.min_length,
                          actual_length: error.context.actual_length,
                      }
                    : undefined,
            )
        case 4000004:
            return createGenericError(
                "InvalidPattern",
                error.context && "pattern" in error.context && typeof error.context.pattern === "string"
                    ? { pattern: error.context.pattern }
                    : undefined,
            )
        case 4000005:
            return createGenericError(
                "PasswordPolicyViolation",
                error.context && "reason" in error.context && typeof error.context.reason === "string"
                    ? {
                          reason: error.context.reason,
                      }
                    : undefined,
            )
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
            return createGenericError(
                "TooLong",
                error.context &&
                    "max_length" in error.context &&
                    typeof error.context.max_length === "number" &&
                    "actual_length" in error.context &&
                    typeof error.context.actual_length === "number"
                    ? {
                          max_length: error.context.max_length,
                          actual_length: error.context.actual_length,
                      }
                    : undefined,
            )
        case 4000018:
            return createGenericError(
                "MustBeGreaterOrEqualThan",
                error.context &&
                    "actual" in error.context &&
                    typeof error.context.actual === "number" &&
                    "minimum" in error.context &&
                    typeof error.context.minimum === "number"
                    ? {
                          actual: error.context.actual,
                          minimum: error.context.minimum,
                      }
                    : undefined,
            )
        case 4000019:
            return createGenericError(
                "MustBeGreaterThan",
                error.context &&
                    "actual" in error.context &&
                    typeof error.context.actual === "number" &&
                    "minimum" in error.context &&
                    typeof error.context.minimum === "number"
                    ? {
                          actual: error.context.actual,
                          minimum: error.context.minimum,
                      }
                    : undefined,
            )
        case 4000020:
            return createGenericError(
                "MustBeLessOrEqualThan",
                error.context &&
                    "actual" in error.context &&
                    typeof error.context.actual === "number" &&
                    "maximum" in error.context &&
                    typeof error.context.maximum === "number"
                    ? {
                          actual: error.context.actual,
                          maximum: error.context.maximum,
                      }
                    : undefined,
            )
        case 4000021:
            return createGenericError(
                "MustBeLessThan",
                error.context &&
                    "actual" in error.context &&
                    typeof error.context.actual === "number" &&
                    "maximum" in error.context &&
                    typeof error.context.maximum === "number"
                    ? {
                          actual: error.context.actual,
                          maximum: error.context.maximum,
                      }
                    : undefined,
            )
        case 4000022:
            return createGenericError(
                "IsNotMultipleOf",
                error.context &&
                    "actual" in error.context &&
                    typeof error.context.actual === "number" &&
                    "base" in error.context &&
                    typeof error.context.base === "number"
                    ? {
                          actual: error.context.actual,
                          base: error.context.base,
                      }
                    : undefined,
            )
        case 4000023:
            return createGenericError(
                "TooManyItems",
                error.context &&
                    "max_items" in error.context &&
                    typeof error.context.max_items === "number" &&
                    "actual_items" in error.context &&
                    typeof error.context.actual_items === "number"
                    ? {
                          max_items: error.context.max_items,
                          actual_items: error.context.actual_items,
                      }
                    : undefined,
            )
        case 4000024:
            return createGenericError(
                "TooFewItems",
                error.context &&
                    "min_items" in error.context &&
                    typeof error.context.min_items === "number" &&
                    "actual_items" in error.context &&
                    typeof error.context.actual_items === "number"
                    ? {
                          min_items: error.context.min_items,
                          actual_items: error.context.actual_items,
                      }
                    : undefined,
            )
        case 4000025:
            return createGenericError(
                "DuplicateItems",
                error.context &&
                    "index_a" in error.context &&
                    typeof error.context.index_a === "number" &&
                    "index_b" in error.context &&
                    typeof error.context.index_b === "number"
                    ? {
                          index_a: error.context.index_a,
                          index_b: error.context.index_b,
                      }
                    : undefined,
            )
        case 4000026:
            return createGenericError(
                "InvalidType",
                error.context &&
                    "actual_type" in error.context &&
                    typeof error.context.actual_type === "string" &&
                    "allowed_types" in error.context &&
                    Array.isArray(error.context.allowed_types) &&
                    error.context.allowed_types.every(type => typeof type === "string")
                    ? {
                          actual_type: error.context.actual_type,
                          allowed_types: error.context.allowed_types,
                      }
                    : undefined,
            )
        case 4000027:
            return createGenericError("AccountAlreadyExists")
        case 4000028:
            return createGenericError(
                "CredentialIdentifierHintAlreadyUsedByOtherAccount",
                error.context &&
                    "available_credential_types" in error.context &&
                    Array.isArray(error.context.available_credential_types) &&
                    error.context.available_credential_types.every(type => typeof type === "string") &&
                    "available_oidc_providers" in error.context &&
                    Array.isArray(error.context.available_oidc_providers) &&
                    error.context.available_oidc_providers.every(type => typeof type === "string") &&
                    "credential_identifier_hint" in error.context &&
                    typeof error.context.credential_identifier_hint === "string"
                    ? {
                          available_credential_types: error.context.available_credential_types,
                          available_oidc_providers: error.context.available_oidc_providers,
                          credential_identifier_hint: error.context.credential_identifier_hint,
                      }
                    : undefined,
            )
        case 4000029:
            return createGenericError(
                "MustBeEqualTo",
                error.context && "expected" in error.context && typeof error.context.expected === "string"
                    ? {
                          expected: error.context.expected,
                      }
                    : undefined,
            )
        case 4000030:
            return createGenericError("ConstFailed")
        case 4000031:
            return createGenericError("PasswordAndIdentifierTooSimilar")
        case 4000032:
            return createGenericError(
                "PasswordTooShort",
                error.context &&
                    "min_length" in error.context &&
                    typeof error.context.min_length === "number" &&
                    "actual_length" in error.context &&
                    typeof error.context.actual_length === "number"
                    ? {
                          min_length: error.context.min_length,
                          actual_length: error.context.actual_length,
                      }
                    : undefined,
            )
        case 4000033:
            return createGenericError(
                "PasswordTooLong",
                error.context &&
                    "max_length" in error.context &&
                    typeof error.context.max_length === "number" &&
                    "actual_length" in error.context &&
                    typeof error.context.actual_length === "number"
                    ? {
                          max_length: error.context.max_length,
                          actual_length: error.context.actual_length,
                      }
                    : undefined,
            )
        case 4000034:
            return createGenericError(
                "PasswordLeaked",
                error.context && "breaches" in error.context && typeof error.context.breaches === "number"
                    ? {
                          breaches: error.context.breaches,
                      }
                    : undefined,
            )
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
            return createLoginFlowError(
                "LoginFlowExpired",
                error.context &&
                    "expired_at" in error.context &&
                    typeof error.context.expired_at === "string" &&
                    "expired_at_unix" in error.context &&
                    typeof error.context.expired_at_unix === "number"
                    ? {
                          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
                          expired_at_unix: error.context.expired_at_unix,
                      }
                    : undefined,
            )
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
            return createRegisterFlowError(
                "RegisterFlowExpired",
                error.context &&
                    "expired_at" in error.context &&
                    typeof error.context.expired_at === "string" &&
                    "expired_at_unix" in error.context &&
                    typeof error.context.expired_at_unix === "number"
                    ? {
                          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
                          expired_at_unix: error.context.expired_at_unix,
                      }
                    : undefined,
            )
        case 4040002:
            return createRegisterFlowError("RegisterRequestAlreadyCompletedSuccessfully")
        case 4040003:
            return createRegisterFlowError("InvalidRegisterCodeOrAlreadyUsed")

        // Settings Flow Errors
        case 4050001:
            return createSettingsFlowError(
                "SettingsFlowExpired",
                error.context &&
                    "expired_at" in error.context &&
                    typeof error.context.expired_at === "string" &&
                    "expired_at_unix" in error.context &&
                    typeof error.context.expired_at_unix === "number"
                    ? {
                          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
                          expired_at_unix: error.context.expired_at_unix,
                      }
                    : undefined,
            )

        // Recovery Flow Errors
        case 4060001:
            return createRecoveryFlowError("RecoveryRequestAlreadyCompletedSuccessfully")
        case 4060002:
            return createRecoveryFlowError("RecoveryFlowFailureState")
        // case 4060003: NO INFO IN DOCS
        case 4060004:
            return createRecoveryFlowError("InvalidTokenOrAlreadyUsed")
        case 4060005:
            return createRecoveryFlowError("RecoveryFlowExpired")
        case 4060006:
            return createRecoveryFlowError("InvalidRecoveryCodeOrAlreadyUsed")

        // Verification Flow Errors
        case 4070001:
            return createVerificationFlowError("InvalidVerifivactionCodeOrAlreadyUsed")
        case 4070002:
            return createVerificationFlowError("VerificationRequestAlreadyCompletedSuccessfully")
        case 4070003:
            return createVerificationFlowError("VerificationFlowFailureState")
        // case 4070004: NO INFO IN DOCS
        case 4070005:
            return createVerificationFlowError(
                "VerificationFlowExpired",
                error.context &&
                    "expired_at" in error.context &&
                    typeof error.context.expired_at === "string" &&
                    "expired_at_unix" in error.context &&
                    typeof error.context.expired_at_unix === "number"
                    ? {
                          expired_at: error.context.expired_at, // ISO 8601 YYYY-MM-DDTHH:mm:ssZ
                          expired_at_unix: error.context.expired_at_unix,
                      }
                    : undefined,
            )
        case 4070006:
            return createVerificationFlowError("InvalidVerificationCodeOrAlreadyUsed")

        // Other Errors
        case 5000001:
        default:
            return createGenericError(
                "Generic",
                error.context && "reason" in error.context && typeof error.context.reason === "string"
                    ? {
                          reason: error.context.reason,
                      }
                    : undefined,
            )
    }
}
