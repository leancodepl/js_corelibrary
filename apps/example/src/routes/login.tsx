import { dataTestIds } from "@example/e2e-ids"
import { loginFlow, verificationFlow } from "@leancodepl/kratos"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import { getErrorMessage, LoginFlow, sessionManager } from "../services/kratos"
import { Input } from "../components/Input"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"

const loginSearchSchema = z.object({
    flow: z.string().optional(),
})

const handleError: loginFlow.OnLoginFlowError = ({ target, errors }) => {
    if (target === "root") {
        alert(`Błędy formularza: ${errors.map(e => e.id).join(", ")}`)
    } else {
        alert(`Błędy pola ${target}: ${errors.map(e => e.id).join(", ")}`)
    }
}

export const Route = createFileRoute("/login")({
    component: RouteComponent,
    validateSearch: loginSearchSchema,
})

function RouteComponent() {
    const { isLoading } = sessionManager.useIsLoggedIn()
    const { flow } = Route.useSearch()
    const removeFlowIdFromUrl = useRemoveFlowFromUrl()
    const nav = useNavigate()

    if (isLoading) {
        return <p>Loading login page...</p>
    }

    return (
        <div data-testid={dataTestIds.login.page}>
            <LoginFlow
                chooseMethodForm={ChooseMethodForm}
                secondFactorForm={SecondFactorForm}
                secondFactorEmailForm={SecondFactorEmailForm}
                emailVerificationForm={EmailVerificationForm}
                onFlowRestart={removeFlowIdFromUrl}
                onSessionAlreadyAvailable={() => {
                    nav({
                        to: "/identity",
                    })
                }}
                initialFlowId={flow}
                onError={handleError}
                returnTo="/identity?after-login=true"
            />
        </div>
    )
}

function ChooseMethodForm(props: loginFlow.ChooseMethodFormProps) {
    if (props.isLoading) {
        return <p>Loading login methods...</p>
    }

    const { Password, Google, Passkey, Apple, Facebook, errors, isSubmitting, isValidating } = props

    if (props.isRefresh) {
        const { identifier } = props

        return (
            <div data-testid={dataTestIds.login.chooseMethodForm.wrapper}>
                <h2>
                    Complete login process as{" "}
                    <strong data-testid={dataTestIds.login.chooseMethodForm.existingIdentifier}>{identifier}</strong>
                </h2>

                {Password && (
                    <Password>
                        <Input
                            data-testid={dataTestIds.login.chooseMethodForm.passwordInput}
                            placeholder="Password"
                            disabled={isSubmitting || isValidating}
                        />
                    </Password>
                )}

                <button
                    data-testid={dataTestIds.login.common.loginButton}
                    type="submit"
                    disabled={isSubmitting || isValidating}>
                    Login
                </button>

                {Google && (
                    <Google>
                        <button
                            data-testid={dataTestIds.login.chooseMethodForm.googleButton}
                            disabled={isSubmitting || isValidating}>
                            Sign in with Google
                        </button>
                    </Google>
                )}

                {Apple && (
                    <Apple>
                        <button
                            data-testid={dataTestIds.login.chooseMethodForm.appleButton}
                            disabled={isSubmitting || isValidating}>
                            Sign in with Apple
                        </button>
                    </Apple>
                )}

                {Facebook && (
                    <Facebook>
                        <button
                            data-testid={dataTestIds.login.chooseMethodForm.facebookButton}
                            disabled={isSubmitting || isValidating}>
                            Sign in with Facebook
                        </button>
                    </Facebook>
                )}

                {Passkey && (
                    <Passkey>
                        <button
                            data-testid={dataTestIds.login.chooseMethodForm.passkeyButton}
                            disabled={isSubmitting || isValidating}>
                            Sign in with Passkey
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

    const { Identifier } = props

    return (
        <div data-testid={dataTestIds.login.chooseMethodForm.wrapper}>
            {Identifier && (
                <Identifier>
                    <Input
                        data-testid={dataTestIds.login.chooseMethodForm.identifierInput}
                        placeholder="Identifier"
                        disabled={isSubmitting || isValidating}
                    />
                </Identifier>
            )}

            {Password && (
                <Password>
                    <Input
                        data-testid={dataTestIds.login.chooseMethodForm.passwordInput}
                        placeholder="Password"
                        disabled={isSubmitting || isValidating}
                    />
                </Password>
            )}

            <button
                data-testid={dataTestIds.login.common.loginButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
                Login
            </button>

            <p>
                Forgot password?{" "}
                <a data-testid={dataTestIds.login.chooseMethodForm.forgotPasswordLink} href="/recovery">
                    Click here to reset it
                </a>
            </p>

            {Google && (
                <Google>
                    <button
                        data-testid={dataTestIds.login.chooseMethodForm.googleButton}
                        disabled={isSubmitting || isValidating}>
                        Sign in with Google
                    </button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button
                        data-testid={dataTestIds.login.chooseMethodForm.appleButton}
                        disabled={isSubmitting || isValidating}>
                        Sign in with Apple
                    </button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button
                        data-testid={dataTestIds.login.chooseMethodForm.facebookButton}
                        disabled={isSubmitting || isValidating}>
                        Sign in with Facebook
                    </button>
                </Facebook>
            )}

            {Passkey && (
                <Passkey>
                    <button
                        data-testid={dataTestIds.login.chooseMethodForm.passkeyButton}
                        disabled={isSubmitting || isValidating}>
                        Sign in with Passkey
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

function SecondFactorForm({ Totp, Email, errors, isSubmitting, isValidating }: loginFlow.SecondFactorFormProps) {
    return (
        <div data-testid={dataTestIds.login.secondFactorForm.wrapper}>
            {Totp && (
                <Totp>
                    <Input
                        data-testid={dataTestIds.login.secondFactorForm.totpInput}
                        placeholder="TOTP"
                        disabled={isSubmitting || isValidating}
                    />
                </Totp>
            )}

            <button
                data-testid={dataTestIds.login.secondFactorForm.loginButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
                Login
            </button>

            {Email && (
                <Email>
                    <button
                        data-testid={dataTestIds.login.secondFactorForm.continueWithEmailButton}
                        disabled={isSubmitting || isValidating}>
                        Continue with email
                    </button>
                </Email>
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

function SecondFactorEmailForm({
    Code,
    Resend,
    errors,
    isSubmitting,
    isValidating,
}: loginFlow.SecondFactorEmailFormProps) {
    return (
        <div data-testid={dataTestIds.login.secondFactorEmailForm.wrapper}>
            <Code>
                <Input
                    data-testid={dataTestIds.login.secondFactorEmailForm.codeInput}
                    placeholder="Code"
                    disabled={isSubmitting || isValidating}
                />
            </Code>

            <button
                data-testid={dataTestIds.login.common.loginButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
                Login
            </button>

            <Resend>
                <button
                    data-testid={dataTestIds.login.secondFactorEmailForm.resendCodeButton}
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

function EmailVerificationForm({
    Code,
    Resend,
    errors,
    isSubmitting,
    isValidating,
}: verificationFlow.EmailVerificationFormProps) {
    return (
        <div data-testid={dataTestIds.login.emailVerificationForm.wrapper}>
            <div>
                Zanim się zalogujesz, musisz zweryfikować swój adres e-mail. Sprawdź swoją skrzynkę odbiorczą i kliknij
                w link, aby zweryfikować swój adres e-mail.
            </div>

            <Code>
                <Input
                    data-testid={dataTestIds.login.emailVerificationForm.codeInput}
                    placeholder="Code"
                    disabled={isSubmitting || isValidating}
                />
            </Code>

            <button
                data-testid={dataTestIds.login.emailVerificationForm.submitButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
                Verify
            </button>

            <Resend>
                <button
                    data-testid={dataTestIds.login.emailVerificationForm.resendButton}
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
