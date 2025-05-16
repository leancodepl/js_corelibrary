import { loginFlow, AuthError, CommonInputFieldProps } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { FC } from "react"
import { z } from "zod"
import { LoginFlow } from "../services/kratos"

const loginSearchSchema = z.object({
    flow: z.string().optional(),
})

const handleError: loginFlow.OnLoginFlowError = ({ target, errors }) => {
    if (target === "root") {
        alert(`Błędy formularza: ${errors.map(e => e.id).join(", ")}`)
    } else {
        alert(`Błędy pola ${target}: ${errors.map(e => e.id).join(", ")}`)
    }
}

export const Route = createFileRoute("/login")({
    component: RouteComponent,
    validateSearch: loginSearchSchema,
})

function RouteComponent() {
    const { flow } = Route.useSearch()
    return (
        <LoginFlow
            chooseMethodForm={ChooseMethodForm}
            secondFactorForm={SecondFactorForm}
            secondFactorEmailForm={SecondFactorEmailForm}
            emailVerificationForm={EmailVerificationForm}
            initialFlowId={flow}
            onError={handleError}
            returnTo="https://host.local.lncd.pl/"
        />
    )
}

const getErrorMessage = (error: AuthError) => {
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

const Input: FC<CommonInputFieldProps & { placeholder?: string }> = ({ errors, ...props }) => (
    <div>
        <input {...props} />
        {errors && errors.length > 0 && (
            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        )}
    </div>
)

function ChooseMethodForm({
    Identifier,
    Password,
    Google,
    Passkey,
    Apple,
    Facebook,
    errors,
}: loginFlow.ChooseMethodFormProps) {
    return (
        <>
            {Identifier && (
                <Identifier>
                    <Input placeholder="Identifier" />
                </Identifier>
            )}
            {Password && (
                <Password>
                    <Input placeholder="Password" />
                </Password>
            )}

            <button type="submit">Login</button>

            {Google && (
                <Google>
                    <button>Sign in with Google</button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button>Sign in with Apple</button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button>Sign in with Facebook</button>
                </Facebook>
            )}

            {Passkey && (
                <Passkey>
                    <button>Sign in with Passkey</button>
                </Passkey>
            )}

            <div>{errors?.map(error => <div key={error.id}>{getErrorMessage(error)}</div>)}</div>
        </>
    )
}

function SecondFactorForm({ Totp, Email, errors }: loginFlow.SecondFactorFormProps) {
    return (
        <>
            {Totp && (
                <Totp>
                    <Input placeholder="TOTP" />
                </Totp>
            )}

            <button type="submit">Login</button>

            {Email && (
                <Email>
                    <button>Continue with email</button>
                </Email>
            )}

            <div>{errors?.map(error => <div key={error.id}>{getErrorMessage(error)}</div>)}</div>
        </>
    )
}

function SecondFactorEmailForm({ Code, Resend, errors }: loginFlow.SecondFactorEmailFormProps) {
    return (
        <>
            <Code>
                <Input placeholder="Code" />
            </Code>

            <button type="submit">Login</button>

            <Resend>
                <button>Resend code</button>
            </Resend>

            <div>{errors?.map(error => <div key={error.id}>{getErrorMessage(error)}</div>)}</div>
        </>
    )
}

function EmailVerificationForm({ Code, Resend, errors }: loginFlow.EmailVerificationFormProps) {
    return (
        <>
            <div>
                Zanim się zalogujesz, musisz zweryfikować swój adres e-mail. Sprawdź swoją skrzynkę odbiorczą i kliknij
                w link, aby zweryfikować swój adres e-mail.
            </div>

            <Code>
                <Input placeholder="Code" />
            </Code>

            <button type="submit">Verify</button>

            <Resend>
                <button>Resend code</button>
            </Resend>

            <div>{errors?.map(error => <div key={error.id}>{getErrorMessage(error)}</div>)}</div>
        </>
    )
}
