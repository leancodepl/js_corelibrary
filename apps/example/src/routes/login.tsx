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
        <div data-testid="login-page">
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
            <div data-testid="choose-method-form">
                <h2>
                    Complete login process as <strong data-testid="existing-identifier">{identifier}</strong>
                </h2>

                {Password && (
                    <Password>
                        <Input
                            data-testid="password-input"
                            placeholder="Password"
                            disabled={isSubmitting || isValidating}
                        />
                    </Password>
                )}

                <button data-testid="login-button" type="submit" disabled={isSubmitting || isValidating}>
                    Login
                </button>

                {Google && (
                    <Google>
                        <button data-testid="google-button" disabled={isSubmitting || isValidating}>
                            Sign in with Google
                        </button>
                    </Google>
                )}

                {Apple && (
                    <Apple>
                        <button data-testid="apple-button" disabled={isSubmitting || isValidating}>
                            Sign in with Apple
                        </button>
                    </Apple>
                )}

                {Facebook && (
                    <Facebook>
                        <button data-testid="facebook-button" disabled={isSubmitting || isValidating}>
                            Sign in with Facebook
                        </button>
                    </Facebook>
                )}

                {Passkey && (
                    <Passkey>
                        <button data-testid="passkey-button" disabled={isSubmitting || isValidating}>
                            Sign in with Passkey
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

    const { Identifier } = props

    return (
        <div data-testid="choose-method-form">
            {Identifier && (
                <Identifier>
                    <Input
                        data-testid="identifier-input"
                        placeholder="Identifier"
                        disabled={isSubmitting || isValidating}
                    />
                </Identifier>
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

            <button data-testid="login-button" type="submit" disabled={isSubmitting || isValidating}>
                Login
            </button>

            <p>
                Forgot password?{" "}
                <a data-testid="forgot-password-link" href="/recovery">
                    Click here to reset it
                </a>
            </p>

            {Google && (
                <Google>
                    <button data-testid="google-button" disabled={isSubmitting || isValidating}>
                        Sign in with Google
                    </button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button data-testid="apple-button" disabled={isSubmitting || isValidating}>
                        Sign in with Apple
                    </button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button data-testid="facebook-button" disabled={isSubmitting || isValidating}>
                        Sign in with Facebook
                    </button>
                </Facebook>
            )}

            {Passkey && (
                <Passkey>
                    <button data-testid="passkey-button" disabled={isSubmitting || isValidating}>
                        Sign in with Passkey
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

function SecondFactorForm({ Totp, Email, errors, isSubmitting, isValidating }: loginFlow.SecondFactorFormProps) {
    return (
        <div data-testid="second-factor-form">
            {Totp && (
                <Totp>
                    <Input data-testid="totp-input" placeholder="TOTP" disabled={isSubmitting || isValidating} />
                </Totp>
            )}

            <button data-testid="login-button" type="submit" disabled={isSubmitting || isValidating}>
                Login
            </button>

            {Email && (
                <Email>
                    <button data-testid="continue-with-email-button" disabled={isSubmitting || isValidating}>
                        Continue with email
                    </button>
                </Email>
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

function SecondFactorEmailForm({
    Code,
    Resend,
    errors,
    isSubmitting,
    isValidating,
}: loginFlow.SecondFactorEmailFormProps) {
    return (
        <>
            <Code>
                <Input
                    data-testid="second-factor-code-input"
                    placeholder="Code"
                    disabled={isSubmitting || isValidating}
                />
            </Code>

            <button data-testid="login-button" type="submit" disabled={isSubmitting || isValidating}>
                Login
            </button>

            <Resend>
                <button data-testid="resend-code-button" disabled={isSubmitting || isValidating}>
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
        <div data-testid="email-verification-form">
            <div>
                Zanim się zalogujesz, musisz zweryfikować swój adres e-mail. Sprawdź swoją skrzynkę odbiorczą i kliknij
                w link, aby zweryfikować swój adres e-mail.
            </div>

            <Code>
                <Input
                    data-testid="email-verification-code-input"
                    placeholder="Code"
                    disabled={isSubmitting || isValidating}
                />
            </Code>

            <button data-testid="email-verification-button" type="submit" disabled={isSubmitting || isValidating}>
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
