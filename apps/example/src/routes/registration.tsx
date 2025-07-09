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
        return <p data-testid="already-logged-in">You are already logged in.</p>
    }

    return (
        <div data-testid="registration-page">
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
        </div>
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
        <div data-testid="traits-form">
            {Email && (
                <Email>
                    <Input data-testid="email-input" placeholder="Email" disabled={isSubmitting || isValidating} />
                </Email>
            )}
            {GivenName && (
                <GivenName>
                    <Input
                        data-testid="given-name-input"
                        placeholder="First name"
                        disabled={isSubmitting || isValidating}
                    />
                </GivenName>
            )}
            {RegulationsAccepted && (
                <RegulationsAccepted>
                    <Checkbox
                        data-testid="regulations-checkbox"
                        type="checkbox"
                        placeholder="Regulations accepted"
                        disabled={isSubmitting || isValidating}>
                        I accept the regulations
                    </Checkbox>
                </RegulationsAccepted>
            )}

            <button data-testid="register-button" type="submit" disabled={isSubmitting || isValidating}>
                Register
            </button>

            {Google && (
                <Google>
                    <button data-testid="google-signup-button" disabled={isSubmitting || isValidating}>
                        Sign up with Google
                    </button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button data-testid="apple-signup-button" disabled={isSubmitting || isValidating}>
                        Sign up with Apple
                    </button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button data-testid="facebook-signup-button" disabled={isSubmitting || isValidating}>
                        Sign up with Facebook
                    </button>
                </Facebook>
            )}

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
        <div data-testid="choose-method-form">
            {ReturnToTraitsForm && (
                <ReturnToTraitsForm>
                    <button data-testid="return-button" disabled={isSubmitting || isValidating}>
                        Return
                    </button>
                </ReturnToTraitsForm>
            )}
            {Password && (
                <Password>
                    <Input
                        data-testid="password-input"
                        placeholder="Password"
                        disabled={isSubmitting || isValidating}
                    />
                </Password>
            )}
            {PasswordConfirmation && (
                <PasswordConfirmation>
                    <Input
                        data-testid="password-confirmation-input"
                        placeholder="Password confirmation"
                        disabled={isSubmitting || isValidating}
                    />
                </PasswordConfirmation>
            )}

            <button data-testid="register-button" type="submit" disabled={isSubmitting || isValidating}>
                Register
            </button>

            {Passkey && (
                <Passkey>
                    <button data-testid="passkey-signup-button" disabled={isSubmitting || isValidating}>
                        Sign up with Passkey
                    </button>
                </Passkey>
            )}

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

function EmailVerificationForm({
    Code,
    Resend,
    errors,
    isSubmitting,
    isValidating,
}: verificationFlow.EmailVerificationFormProps) {
    return (
        <div data-testid="email-verification-form">
            <Code>
                <Input
                    data-testid="email-verification-code-input"
                    placeholder="Code"
                    disabled={isSubmitting || isValidating}
                />
            </Code>

            <button
                data-testid="email-verification-submit-button"
                type="submit"
                disabled={isSubmitting || isValidating}>
                Verify
            </button>

            <Resend>
                <button data-testid="email-verification-resend-button" disabled={isSubmitting || isValidating}>
                    Resend code
                </button>
            </Resend>

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
