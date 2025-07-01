import type { AuthTraitsConfig } from "../services/kratos"

import { registrationFlow, verificationFlow } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { RegistrationFlow, getErrorMessage, sessionManager } from "../services/kratos"
import { Checkbox } from "../components/Checkbox"
import { Input } from "../components/Input"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"

const registrationSearchSchema = z.object({
    flow: z.string().optional(),
})

const handleError: registrationFlow.OnRegistrationFlowError<AuthTraitsConfig> = ({ target, errors }) => {
    if (target === "root") {
        alert(`Błędy formularza: ${errors.map(e => e.id).join(", ")}`)
    } else {
        alert(`Błędy pola ${target}: ${errors.map(e => e.id).join(", ")}`)
    }
}

export const Route = createFileRoute("/registration")({
    component: RouteComponent,
    validateSearch: registrationSearchSchema,
})

function RouteComponent() {
    const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn()
    const { flow } = Route.useSearch()
    const removeFlowIdFromUrl = useRemoveFlowFromUrl()

    if (isLoading) {
        return <p>Loading registration page...</p>
    }

    if (isLoggedIn) {
        return <p>You are already logged in.</p>
    }

    return (
        <RegistrationFlow
            traitsForm={TraitsForm}
            chooseMethodForm={ChooseMethodForm}
            emailVerificationForm={EmailVerificationForm}
            onRegistrationSuccess={() => {
                alert("Registration successful")
            }}
            onVerificationSuccess={() => {
                alert("Verification successful")
            }}
            initialFlowId={flow}
            onError={handleError}
            onFlowRestart={removeFlowIdFromUrl}
            returnTo="/redirect-after-registration"
        />
    )
}

function TraitsForm({
    errors,
    Email,
    RegulationsAccepted,
    GivenName,
    Google,
    Apple,
    Facebook,
    isSubmitting,
    isValidating,
}: registrationFlow.TraitsFormProps<AuthTraitsConfig>) {
    return (
        <>
            {Email && (
                <Email>
                    <Input placeholder="Email" disabled={isSubmitting || isValidating} />
                </Email>
            )}
            {GivenName && (
                <GivenName>
                    <Input placeholder="First name" disabled={isSubmitting || isValidating} />
                </GivenName>
            )}
            {RegulationsAccepted && (
                <RegulationsAccepted>
                    <Checkbox
                        type="checkbox"
                        placeholder="Regulations accepted"
                        disabled={isSubmitting || isValidating}>
                        I accept the regulations
                    </Checkbox>
                </RegulationsAccepted>
            )}

            <button type="submit" disabled={isSubmitting || isValidating}>
                Register
            </button>

            {Google && (
                <Google>
                    <button disabled={isSubmitting || isValidating}>Sign up with Google</button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button disabled={isSubmitting || isValidating}>Sign up with Apple</button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button disabled={isSubmitting || isValidating}>Sign up with Facebook</button>
                </Facebook>
            )}

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </>
    )
}

function ChooseMethodForm({
    errors,
    ReturnToTraitsForm,
    Password,
    PasswordConfirmation,
    Passkey,
    isSubmitting,
    isValidating,
}: registrationFlow.ChooseMethodFormProps) {
    return (
        <>
            {ReturnToTraitsForm && (
                <ReturnToTraitsForm>
                    <button disabled={isSubmitting || isValidating}>Return</button>
                </ReturnToTraitsForm>
            )}
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
                Register
            </button>

            {Passkey && (
                <Passkey>
                    <button disabled={isSubmitting || isValidating}>Sign up with Passkey</button>
                </Passkey>
            )}

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </>
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

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </>
    )
}
