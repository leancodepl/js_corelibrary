import { dataTestIds } from "@example/e2e-ids"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { verificationFlow } from "@leancodepl/kratos"
import { Input } from "../components/Input"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"
import { getErrorMessage, VerificationFlow } from "../services/kratos"

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
                initialFlowId={flow}
                returnTo="/redirect-after-verification"
                onError={handleError}
                onFlowRestart={removeFlowIdFromUrl}
                onVerificationSuccess={() => {
                    alert("Recovery successful")
                }}
            />
        </div>
    )
}

function EmailVerificationForm({
    Code,
    CodeSubmit,
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
                    disabled={isSubmitting || isValidating}
                    placeholder="Code"
                />
            </Code>

            <CodeSubmit>
                <button
                    data-testid={dataTestIds.verification.emailVerificationForm.submitButton}
                    disabled={isSubmitting || isValidating}>
                    Verify
                </button>
            </CodeSubmit>

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
