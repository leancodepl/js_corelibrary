import { recoveryFlow, settingsFlow } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { getErrorMessage, RecoveryFlow } from "../services/kratos"
import { Input } from "../components/Input"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"

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
    const removeFlowIdFromUrl = useRemoveFlowFromUrl()

    return (
        <div data-testid="recovery-page">
            <RecoveryFlow
                emailForm={EmailForm}
                codeForm={CodeForm}
                newPasswordForm={NewPasswordForm}
                onRecoverySuccess={() => {
                    alert("Recovery successful")
                }}
                initialFlowId={flow}
                onError={handleError}
                onFlowRestart={removeFlowIdFromUrl}
                returnTo="/redirect-after-recovery"
            />
        </div>
    )
}

function EmailForm({ errors, Email, isSubmitting, isValidating }: recoveryFlow.EmailFormProps) {
    return (
        <div data-testid="email-form">
            {Email && (
                <Email>
                    <Input data-testid="email-input" placeholder="Email" disabled={isSubmitting || isValidating} />
                </Email>
            )}

            <button data-testid="email-submit-button" type="submit" disabled={isSubmitting || isValidating}>
                Send code
            </button>

            {errors && errors.length > 0 && (
                <div data-testid="errors">
                    {errors.map(error => (
                        <div key={error.id}>{getErrorMessage(error)}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

function CodeForm({ errors, Code, isSubmitting, isValidating }: recoveryFlow.CodeFormProps) {
    return (
        <div data-testid="code-form">
            <p>Please enter the code you received in the email.</p>

            {Code && (
                <Code>
                    <Input data-testid="code-input" placeholder="Code" disabled={isSubmitting || isValidating} />
                </Code>
            )}

            <button data-testid="code-submit-button" type="submit" disabled={isSubmitting || isValidating}>
                Verify
            </button>

            {errors && errors.length > 0 && (
                <div data-testid="errors">
                    {errors.map(error => (
                        <div key={error.id}>{getErrorMessage(error)}</div>
                    ))}
                </div>
            )}
        </div>
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
        <div data-testid="new-password-form">
            {Password && (
                <Password>
                    <Input
                        data-testid="new-password-input"
                        placeholder="Password"
                        disabled={isSubmitting || isValidating}
                    />
                </Password>
            )}
            {PasswordConfirmation && (
                <PasswordConfirmation>
                    <Input
                        data-testid="new-password-confirmation-input"
                        placeholder="Password confirmation"
                        disabled={isSubmitting || isValidating}
                    />
                </PasswordConfirmation>
            )}

            <button data-testid="new-password-submit-button" type="submit" disabled={isSubmitting || isValidating}>
                Set new password
            </button>

            {errors && errors.length > 0 && (
                <div data-testid="errors">
                    {errors.map(error => (
                        <div key={error.id}>{getErrorMessage(error)}</div>
                    ))}
                </div>
            )}
        </div>
    )
}
