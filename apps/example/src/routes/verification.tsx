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
        <VerificationFlow
            emailVerificationForm={EmailVerificationForm}
            onVerificationSuccess={() => {
                alert("Recovery successful")
            }}
            initialFlowId={flow}
            onError={handleError}
            onFlowRestart={removeFlowIdFromUrl}
            returnTo="/redirect-after-recovery"
        />
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
        <>
            <Code>
                <Input placeholder="Code" disabled={isSubmitting || isValidating} />
            </Code>

            <button type="submit" disabled={isSubmitting || isValidating}>
                Verify
            </button>

            <Resend>
                <button disabled={isSubmitting || isValidating}>Resend code</button>
            </Resend>

            {errors && errors.length > 0 && (
                <div data-testid="errors">
                    {errors.map(error => (
                        <div key={error.id}>{getErrorMessage(error)}</div>
                    ))}
                </div>
            )}
        </>
    )
}
