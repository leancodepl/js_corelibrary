import { dataTestIds } from "@example/e2e-ids"
import { z } from "zod"
import { createFileRoute } from "@tanstack/react-router"
import { verificationFlow } from "@leancodepl/kratos"
import { getErrorMessage, VerificationFlow } from "../services/kratos"
import { Input } from "../components/Input"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"

const verificationSearchSchema = z.object({
    flow: z.string().optional(),
})

const handleError: verificationFlow.OnVerificationFlowError = ({ target, errors }) => {
    if (target === "root") {
        alert(`Błędy formularza: ${errors.map(e => e.id).join(", ")}`)
    } else {
        alert(`Błędy pola ${target}: ${errors.map(e => e.id).join(", ")}`)
    }
}

export const Route = createFileRoute("/verification")({
    component: RouteComponent,
    validateSearch: verificationSearchSchema,
})

function RouteComponent() {
    const { flow } = Route.useSearch()
    const removeFlowIdFromUrl = useRemoveFlowFromUrl()

    return (
        <div data-testid={dataTestIds.verification.page}>
            <VerificationFlow
                emailVerificationForm={EmailVerificationForm}
                onVerificationSuccess={() => {
                    alert("Recovery successful")
                }}
                initialFlowId={flow}
                onError={handleError}
                onFlowRestart={removeFlowIdFromUrl}
                returnTo="/redirect-after-verification"
            />
        </div>
    )
}

function EmailVerificationForm({
    Code,
    Resend,
    errors,
    isSubmitting,
    isValidating,
}: verificationFlow.EmailVerificationFormProps) {
    return (
        <div data-testid={dataTestIds.verification.emailVerificationForm.wrapper}>
            <Code>
                <Input
                    data-testid={dataTestIds.verification.emailVerificationForm.codeInput}
                    placeholder="Code"
                    disabled={isSubmitting || isValidating}
                />
            </Code>

            <button
                data-testid={dataTestIds.verification.emailVerificationForm.submitButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
                Verify
            </button>

            <Resend>
                <button
                    data-testid={dataTestIds.verification.emailVerificationForm.resendButton}
                    disabled={isSubmitting || isValidating}>
                    Resend code
                </button>
            </Resend>

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
