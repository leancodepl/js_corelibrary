import { dataTestIds } from "@example/e2e-ids"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { registrationFlow, verificationFlow } from "@leancodepl/kratos"
import { Checkbox } from "../components/Checkbox"
import { Input } from "../components/Input"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"
import { getErrorMessage, RegistrationFlow, sessionManager } from "../services/kratos"
import type { AuthTraitsConfig } from "../services/kratos"

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
        return <p data-testid={dataTestIds.registration.alreadyLoggedIn}>You are already logged in.</p>
    }

    return (
        <div data-testid={dataTestIds.registration.page}>
            <RegistrationFlow
                chooseMethodForm={ChooseMethodForm}
                emailVerificationForm={EmailVerificationForm}
                initialFlowId={flow}
                returnTo="/redirect-after-registration"
                traitsForm={TraitsForm}
                onError={handleError}
                onFlowRestart={removeFlowIdFromUrl}
                onRegistrationSuccess={() => {
                    alert("Registration successful")
                }}
                onVerificationSuccess={() => {
                    alert("Verification successful")
                }}
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
        <div data-testid={dataTestIds.registration.traitsForm.wrapper}>
            {Email && (
                <Email>
                    <Input
                        data-testid={dataTestIds.registration.traitsForm.emailInput}
                        disabled={isSubmitting || isValidating}
                        placeholder="Email"
                    />
                </Email>
            )}
            {GivenName && (
                <GivenName>
                    <Input
                        data-testid={dataTestIds.registration.traitsForm.givenNameInput}
                        disabled={isSubmitting || isValidating}
                        placeholder="First name"
                    />
                </GivenName>
            )}
            {RegulationsAccepted && (
                <RegulationsAccepted>
                    <Checkbox
                        data-testid={dataTestIds.registration.traitsForm.regulationsCheckbox}
                        disabled={isSubmitting || isValidating}
                        placeholder="Regulations accepted"
                        type="checkbox">
                        I accept the regulations
                    </Checkbox>
                </RegulationsAccepted>
            )}

            <button
                data-testid={dataTestIds.registration.common.registerButton}
                disabled={isSubmitting || isValidating}
                type="submit">
                Register
            </button>

            {Google && (
                <Google>
                    <button
                        data-testid={dataTestIds.registration.traitsForm.googleButton}
                        disabled={isSubmitting || isValidating}>
                        Sign up with Google
                    </button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button
                        data-testid={dataTestIds.registration.traitsForm.appleButton}
                        disabled={isSubmitting || isValidating}>
                        Sign up with Apple
                    </button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button
                        data-testid={dataTestIds.registration.traitsForm.facebookButton}
                        disabled={isSubmitting || isValidating}>
                        Sign up with Facebook
                    </button>
                </Facebook>
            )}

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
        <div data-testid={dataTestIds.registration.chooseMethodForm.wrapper}>
            {ReturnToTraitsForm && (
                <ReturnToTraitsForm>
                    <button
                        data-testid={dataTestIds.registration.chooseMethodForm.returnButton}
                        disabled={isSubmitting || isValidating}>
                        Return
                    </button>
                </ReturnToTraitsForm>
            )}
            {Password && (
                <Password>
                    <Input
                        data-testid={dataTestIds.registration.chooseMethodForm.passwordInput}
                        disabled={isSubmitting || isValidating}
                        placeholder="Password"
                    />
                </Password>
            )}
            {PasswordConfirmation && (
                <PasswordConfirmation>
                    <Input
                        data-testid={dataTestIds.registration.chooseMethodForm.passwordConfirmationInput}
                        disabled={isSubmitting || isValidating}
                        placeholder="Password confirmation"
                    />
                </PasswordConfirmation>
            )}

            <button
                data-testid={dataTestIds.registration.common.registerButton}
                disabled={isSubmitting || isValidating}
                type="submit">
                Register
            </button>

            {Passkey && (
                <Passkey>
                    <button
                        data-testid={dataTestIds.registration.chooseMethodForm.passkeyButton}
                        disabled={isSubmitting || isValidating}>
                        Sign up with Passkey
                    </button>
                </Passkey>
            )}

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

function EmailVerificationForm({
    Code,
    Resend,
    errors,
    isSubmitting,
    isValidating,
}: verificationFlow.EmailVerificationFormProps) {
    return (
        <div data-testid={dataTestIds.registration.emailVerificationForm.wrapper}>
            <Code>
                <Input
                    data-testid={dataTestIds.registration.emailVerificationForm.codeInput}
                    disabled={isSubmitting || isValidating}
                    placeholder="Code"
                />
            </Code>

            <button
                data-testid={dataTestIds.registration.emailVerificationForm.submitButton}
                disabled={isSubmitting || isValidating}
                type="submit">
                Verify
            </button>

            <Resend>
                <button
                    data-testid={dataTestIds.registration.emailVerificationForm.resendButton}
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
