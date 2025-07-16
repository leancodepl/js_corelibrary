import { dataTestIds } from "@example/e2e-ids"
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
        <div data-testid={dataTestIds.recovery.page}>
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
        <div data-testid={dataTestIds.recovery.emailForm.wrapper}>
            {Email && (
                <Email>
                    <Input
                        data-testid={dataTestIds.recovery.emailForm.emailInput}
                        placeholder="Email"
                        disabled={isSubmitting || isValidating}
                    />
                </Email>
            )}

            <button
                data-testid={dataTestIds.recovery.emailForm.submitButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
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
                        placeholder="Code"
                        disabled={isSubmitting || isValidating}
                    />
                </Code>
            )}

            <button
                data-testid={dataTestIds.recovery.codeForm.submitButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
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
                        placeholder="Password"
                        disabled={isSubmitting || isValidating}
                    />
                </Password>
            )}
            {PasswordConfirmation && (
                <PasswordConfirmation>
                    <Input
                        data-testid={dataTestIds.recovery.newPasswordForm.newPasswordConfirmationInput}
                        placeholder="Password confirmation"
                        disabled={isSubmitting || isValidating}
                    />
                </PasswordConfirmation>
            )}

            <button
                data-testid={dataTestIds.recovery.newPasswordForm.submitButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
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
