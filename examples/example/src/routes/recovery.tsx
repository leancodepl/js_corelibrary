import { dataTestIds } from "@example/e2e-ids"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { recoveryFlow, settingsFlow } from "@leancodepl/kratos"
import { Input } from "../components/Input"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"
import { getErrorMessage, RecoveryFlow } from "../services/kratos"

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
        <div data-testid={dataTestIds.recovery.page}>
            <RecoveryFlow
                codeForm={CodeForm}
                emailForm={EmailForm}
                initialFlowId={flow}
                newPasswordForm={NewPasswordForm}
                returnTo="/redirect-after-recovery"
                onError={handleError}
                onFlowRestart={removeFlowIdFromUrl}
                onRecoverySuccess={() => {
                    alert("Recovery successful")
                }}
            />
        </div>
    )
}

function EmailForm({ errors, Email, isSubmitting, isValidating }: recoveryFlow.EmailFormProps) {
    return (
        <div data-testid={dataTestIds.recovery.emailForm.wrapper}>
            {Email && (
                <Email>
                    <Input
                        data-testid={dataTestIds.recovery.emailForm.emailInput}
                        disabled={isSubmitting || isValidating}
                        placeholder="Email"
                    />
                </Email>
            )}

            <button
                data-testid={dataTestIds.recovery.emailForm.submitButton}
                disabled={isSubmitting || isValidating}
                type="submit">
                Send code
            </button>

            {errors && errors.length > 0 && (
                <div data-testid={dataTestIds.common.errors}>
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
        <div data-testid={dataTestIds.recovery.codeForm.wrapper}>
            <p>Please enter the code you received in the email.</p>

            {Code && (
                <Code>
                    <Input
                        data-testid={dataTestIds.recovery.codeForm.codeInput}
                        disabled={isSubmitting || isValidating}
                        placeholder="Code"
                    />
                </Code>
            )}

            <button
                data-testid={dataTestIds.recovery.codeForm.submitButton}
                disabled={isSubmitting || isValidating}
                type="submit">
                Verify
            </button>

            {errors && errors.length > 0 && (
                <div data-testid={dataTestIds.common.errors}>
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
        <div data-testid={dataTestIds.recovery.newPasswordForm.wrapper}>
            {Password && (
                <Password>
                    <Input
                        data-testid={dataTestIds.recovery.newPasswordForm.newPasswordInput}
                        disabled={isSubmitting || isValidating}
                        placeholder="Password"
                    />
                </Password>
            )}
            {PasswordConfirmation && (
                <PasswordConfirmation>
                    <Input
                        data-testid={dataTestIds.recovery.newPasswordForm.newPasswordConfirmationInput}
                        disabled={isSubmitting || isValidating}
                        placeholder="Password confirmation"
                    />
                </PasswordConfirmation>
            )}

            <button
                data-testid={dataTestIds.recovery.newPasswordForm.submitButton}
                disabled={isSubmitting || isValidating}
                type="submit">
                Set new password
            </button>

            {errors && errors.length > 0 && (
                <div data-testid={dataTestIds.common.errors}>
                    {errors.map(error => (
                        <div key={error.id}>{getErrorMessage(error)}</div>
                    ))}
                </div>
            )}
        </div>
    )
}
