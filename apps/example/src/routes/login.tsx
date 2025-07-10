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
            returnTo="https://host.local.lncd.pl/redirect-after-login"
        />
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
            <>
                <h2>
                    Complete login process as <strong>{identifier}</strong>
                </h2>

                {Password && (
                    <Password>
                        <Input placeholder="Password" disabled={isSubmitting || isValidating} />
                    </Password>
                )}

                <button type="submit" disabled={isSubmitting || isValidating}>
                    Login
                </button>

                {Google && (
                    <Google>
                        <button disabled={isSubmitting || isValidating}>Sign in with Google</button>
                    </Google>
                )}

                {Apple && (
                    <Apple>
                        <button disabled={isSubmitting || isValidating}>Sign in with Apple</button>
                    </Apple>
                )}

                {Facebook && (
                    <Facebook>
                        <button disabled={isSubmitting || isValidating}>Sign in with Facebook</button>
                    </Facebook>
                )}

                {Passkey && (
                    <Passkey>
                        <button disabled={isSubmitting || isValidating}>Sign in with Passkey</button>
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

    const { Identifier } = props

    return (
        <>
            {Identifier && (
                <Identifier>
                    <Input placeholder="Identifier" disabled={isSubmitting || isValidating} />
                </Identifier>
            )}

            {Password && (
                <Password>
                    <Input placeholder="Password" disabled={isSubmitting || isValidating} />
                </Password>
            )}

            <button type="submit" disabled={isSubmitting || isValidating}>
                Login
            </button>

            <p>
                Forgot password? <a href="/recovery">Click here to reset it</a>
            </p>

            {Google && (
                <Google>
                    <button disabled={isSubmitting || isValidating}>Sign in with Google</button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button disabled={isSubmitting || isValidating}>Sign in with Apple</button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button disabled={isSubmitting || isValidating}>Sign in with Facebook</button>
                </Facebook>
            )}

            {Passkey && (
                <Passkey>
                    <button disabled={isSubmitting || isValidating}>Sign in with Passkey</button>
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

function SecondFactorForm({ Totp, Email, errors, isSubmitting, isValidating }: loginFlow.SecondFactorFormProps) {
    return (
        <>
            {Totp && (
                <Totp>
                    <Input placeholder="TOTP" disabled={isSubmitting || isValidating} />
                </Totp>
            )}

            <button type="submit" disabled={isSubmitting || isValidating}>
                Login
            </button>

            {Email && (
                <Email>
                    <button disabled={isSubmitting || isValidating}>Continue with email</button>
                </Email>
            )}

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </>
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
                <Input placeholder="Code" disabled={isSubmitting || isValidating} />
            </Code>

            <button type="submit" disabled={isSubmitting || isValidating}>
                Login
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

function EmailVerificationForm({
    Code,
    Resend,
    errors,
    isSubmitting,
    isValidating,
}: verificationFlow.EmailVerificationFormProps) {
    return (
        <>
            <div>
                Zanim się zalogujesz, musisz zweryfikować swój adres e-mail. Sprawdź swoją skrzynkę odbiorczą i kliknij
                w link, aby zweryfikować swój adres e-mail.
            </div>

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
