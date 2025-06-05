import { AuthError, BaseSessionManager, mkKratos } from "@leancodepl/kratos"
import { map } from "rxjs/operators"

class SessionManager extends BaseSessionManager<AuthTraitsConfig> {
    metadata$ = this.identity$.pipe(
        map(identity => {
            const metadata: unknown = identity?.metadata_public

            return metadata && typeof metadata === "object" ? metadata : undefined
        }),
    )

    wasLoginSet$ = this.metadata$.pipe(
        map(metadata =>
            metadata && "was_login_set" in metadata && typeof metadata.was_login_set === "boolean"
                ? metadata.was_login_set
                : undefined,
        ),
    )

    regulationsAcceptedAt$ = this.metadata$.pipe(
        map(metadata =>
            metadata && "regulations_accepted_at" in metadata && typeof metadata.regulations_accepted_at === "string"
                ? new Date(metadata.regulations_accepted_at)
                : undefined,
        ),
    )

    regulationsAccepted$ = this.regulationsAcceptedAt$.pipe(map(regulationsAcceptedAt => !!regulationsAcceptedAt))

    traits$ = this.identity$.pipe(
        map(identity => {
            const traits = identity?.traits

            return traits && typeof traits === "object" ? traits : undefined
        }),
    )

    email$ = this.traits$.pipe(
        map(traits => {
            return traits && "email" in traits && typeof traits.email === "string" ? traits.email : undefined
        }),
    )

    firstName$ = this.traits$.pipe(
        map(traits => {
            return traits && "given_name" in traits && typeof traits.given_name === "string"
                ? traits.given_name
                : undefined
        }),
    )

    lastName$ = this.traits$.pipe(
        map(traits => {
            return traits && "last_name" in traits && typeof traits.last_name === "string"
                ? traits.last_name
                : undefined
        }),
    )
}

const traitsConfig = {
    Email: {
        trait: "email",
        type: "string",
    },
    GivenName: {
        trait: "given_name",
        type: "string",
    },
    RegulationsAccepted: {
        trait: "regulations_accepted",
        type: "boolean",
    },
} as const

const {
    session: { sessionManager },
    providers: { KratosProviders },
    flows: { RegistrationFlow, LoginFlow, RecoveryFlow, SettingsFlow, VerificationFlow, useLogout },
} = mkKratos({
    basePath: "https://auth.local.lncd.pl",
    traits: traitsConfig,
    makeSessionManager: (api, basePath, loginPath) => new SessionManager(api, basePath, loginPath),
})

export {
    sessionManager,
    KratosProviders,
    RegistrationFlow,
    LoginFlow,
    RecoveryFlow,
    SettingsFlow,
    VerificationFlow,
    useLogout,
}

export type AuthTraitsConfig = typeof traitsConfig

export const getErrorMessage = (error: AuthError) => {
    switch (error.id) {
        case "Error_InvalidFormat":
            return "Nieprawidłowa wartość"
        case "Error_InvalidFormat_WithContext":
            return `Nieprawidłowa wartość: ${error.context.reason}`
        case "Error_MissingProperty":
            return "To pole jest wymagane"
        case "Error_MissingProperty_WithContext":
            return `Pole "${error.context.property}" jest wymagane`
        case "Error_TooShort_WithContext":
            return `Liczba znaków musi być większa niż ${error.context.min_length}`
        case "Error_TooShort":
            return "Wprowadzona wartość jest zbyt krótka"
        case "Error_InvalidPattern_WithContext":
            return `Wartość powinna mieć format: ${error.context.pattern}`
        case "Error_InvalidPattern":
            return "Wprowadzona wartość nie pasuje do wzorca"
        case "Error_PasswordPolicyViolation":
            return "Wprowadzone hasło nie może zostać użyte"
        case "Error_InvalidCredentials":
            return "Wprowadzone dane są nieprawidłowe, sprawdź literówki w adresie e-mail lub haśle"
        default:
            return "originalError" in error ? error.originalError.text : error.id
    }
}
