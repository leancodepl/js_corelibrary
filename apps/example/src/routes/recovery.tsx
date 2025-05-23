import { recoveryFlow, settingsFlow } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { getErrorMessage, RecoveryFlow } from "../services/kratos"
import { Input } from "../components/Input"

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
            <p>Please enter the code you received in the email.</p>

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
