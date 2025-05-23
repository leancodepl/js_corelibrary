import { recoveryFlow, AuthError, CommonInputFieldProps, settingsFlow } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { FC } from "react"
import { z } from "zod"
import { RecoveryFlow } from "../services/kratos"

const recoverySearchSchema = z.object({
    flow: z.string().optional(),
})

const handleError: recoveryFlow.OnRecoveryFlowError = ({ target, errors }) => {
    if (target === "root") {
        alert(`Błędy formularza: ${errors.map(e => e.id).join(", ")}`)
    } else {
        alert(`Błędy pola ${target}: ${errors.map(e => e.id).join(", ")}`)
    }
}

export const Route = createFileRoute("/recovery")({
    component: RouteComponent,
    validateSearch: recoverySearchSchema,
})

function RouteComponent() {
    const { flow } = Route.useSearch()

    return (
        <RecoveryFlow
            emailForm={EmailForm}
            codeForm={CodeForm}
            newPasswordForm={NewPasswordForm}
            onRecoverySuccess={() => {
                alert("Recovery successful")
            }}
            initialFlowId={flow}
            onError={handleError}
            returnTo="/redirect-after-recovery"
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
        case "Error_MustBeEqualTo_WithContext":
            return `Wartość musi być: ${error.context.expected}`
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

function EmailForm({ errors, Email, isSubmitting, isValidating }: recoveryFlow.EmailFormProps) {
    return (
        <>
            {Email && (
                <Email>
                    <Input placeholder="Email" disabled={isSubmitting || isValidating} />
                </Email>
            )}

            <button type="submit" disabled={isSubmitting || isValidating}>
                Send code
            </button>

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </>
    )
}

function CodeForm({ errors, Code, isSubmitting, isValidating }: recoveryFlow.CodeFormProps) {
    return (
        <>
            {Code && (
                <Code>
                    <Input placeholder="Code" disabled={isSubmitting || isValidating} />
                </Code>
            )}

            <button type="submit" disabled={isSubmitting || isValidating}>
                Verify
            </button>

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </>
    )
}

function NewPasswordForm({
    errors,
    Password,
    PasswordConfirmation,
    isSubmitting,
    isValidating,
}: settingsFlow.NewPasswordFormProps) {
    return (
        <>
            {Password && (
                <Password>
                    <Input placeholder="Password" disabled={isSubmitting || isValidating} />
                </Password>
            )}
            {PasswordConfirmation && (
                <PasswordConfirmation>
                    <Input placeholder="Password confirmation" disabled={isSubmitting || isValidating} />
                </PasswordConfirmation>
            )}

            <button type="submit" disabled={isSubmitting || isValidating}>
                Set new password
            </button>

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </>
    )
}
