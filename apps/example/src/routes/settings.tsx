import { z } from "zod"
import { settingsFlow } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { Input } from "../components/Input"
import { AuthTraitsConfig, getErrorMessage, sessionManager, SettingsFlow } from "../services/kratos"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"

const settingsSearchSchema = z.object({
    flow: z.string().optional(),
})

const handleError: settingsFlow.OnSettingsFlowError<AuthTraitsConfig> = ({ target, errors }) => {
    if (target === "root") {
        alert(`Błędy formularza: ${errors.map(e => e.id).join(", ")}`)
    } else {
        alert(`Błędy pola ${target}: ${errors.map(e => e.id).join(", ")}`)
    }
}

export const Route = createFileRoute("/settings")({
    component: RouteComponent,
    validateSearch: settingsSearchSchema,
})

function RouteComponent() {
    const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn()
    const { flow } = Route.useSearch()
    const removeFlowIdFromUrl = useRemoveFlowFromUrl()

    if (isLoading) {
        return <p data-testid="settings-loading">Loading settings page...</p>
    }

    if (!isLoggedIn) {
        return <p data-testid="settings-not-logged-in">You must be logged in to access settings.</p>
    }

    return (
        <div data-testid="settings-page">
            <SettingsFlow
                traitsForm={TraitsForm}
                newPasswordForm={NewPasswordForm}
                passkeysForm={PasskeysForm}
                totpForm={TotpForm}
                oidcForm={OidcForm}
                settingsForm={({
                    emailVerificationRequired,
                    newPasswordForm,
                    traitsForm,
                    passkeysForm,
                    totpForm,
                    oidcForm,
                }) => {
                    return (
                        <div style={emailVerificationRequired ? { backgroundColor: "#f8d7da" } : {}}>
                            {traitsForm}
                            {newPasswordForm}
                            {passkeysForm}
                            {totpForm}
                            {oidcForm}
                        </div>
                    )
                }}
                onChangePasswordSuccess={() => {
                    alert("change password success")
                }}
                onChangeTraitsSuccess={() => {
                    alert("change traits success")
                }}
                initialFlowId={flow}
                onError={handleError}
                onFlowRestart={removeFlowIdFromUrl}
            />
        </div>
    )
}

function TraitsForm({
    errors,
    Email,
    GivenName,
    isLoading,
    isSubmitting,
    isValidating,
    emailVerificationRequired,
}: settingsFlow.TraitsFormProps<AuthTraitsConfig>) {
    if (isLoading) {
        return <p data-testid="traits-form-loading">Loading traits form...</p>
    }

    return (
        <div data-testid="traits-form">
            <h2>Traits</h2>

            {emailVerificationRequired && (
                <div data-testid="email-verification-required-info">
                    <h2>Email verification required</h2>
                    <p>Please verify your email address to continue.</p>
                </div>
            )}

            {Email && (
                <Email>
                    <Input
                        data-testid="email-input"
                        placeholder="Email"
                        disabled={emailVerificationRequired || isSubmitting || isValidating}
                    />
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

            <button data-testid="traits-form-update-button" type="submit" disabled={isSubmitting || isValidating}>
                Update
            </button>

            {errors && errors.length > 0 && (
                <div data-testid="traits-form-errors">
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
    isLoading,
    isSubmitting,
    isValidating,
}: settingsFlow.NewPasswordFormProps) {
    if (isLoading) {
        return <p data-testid="new-password-form-loading">Loading new password form...</p>
    }

    return (
        <div data-testid="new-password-form">
            <h2>New password</h2>

            {Password && (
                <Password>
                    <Input
                        data-testid="new-password-input"
                        placeholder="Password"
                        disabled={isSubmitting || isValidating}
                    />
                </Password>
            )}
            {PasswordConfirmation && (
                <PasswordConfirmation>
                    <Input
                        data-testid="new-password-confirmation-input"
                        placeholder="Password confirmation"
                        disabled={isSubmitting || isValidating}
                    />
                </PasswordConfirmation>
            )}

            <button data-testid="new-password-form-submit-button" type="submit" disabled={isSubmitting || isValidating}>
                Set new password
            </button>

            {errors && errors.length > 0 && (
                <div data-testid="new-password-form-errors">
                    {errors.map(error => (
                        <div key={error.id}>{getErrorMessage(error)}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

function PasskeysForm({ addNewPasskey, existingPasskeys, isPending, isLoading }: settingsFlow.PasskeysFormProps) {
    if (isLoading) {
        return <p data-testid="passkeys-form-loading">Loading passkeys...</p>
    }

    return (
        <div data-testid="passkeys-form">
            <h2>Passkeys</h2>

            {addNewPasskey && (
                <button data-testid="add-new-passkey-button" disabled={isPending} onClick={addNewPasskey}>
                    Add new passkey
                </button>
            )}

            <div data-testid="existing-passkeys">
                <h3>Existing Passkeys</h3>

                {existingPasskeys.map(passkey => (
                    <div data-testid="existing-passkey" key={passkey.id}>
                        <strong>{passkey.name} </strong>
                        <span>({new Date(passkey.addedAtUnix * 1000).toLocaleString()}) </span>
                        <button
                            data-testid="remove-passkey-button"
                            onClick={passkey.removePasskey}
                            disabled={isPending}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function TotpForm(props: settingsFlow.TotpFormProps) {
    if (props.isLoading) {
        return <p data-testid="totp-form-loading">Loading TOTP form...</p>
    }

    if (props.isTotpLinked) {
        const { Unlink } = props

        return (
            <div data-testid="totp-form-linked">
                <h2>TOTP is already linked</h2>
                <p>You can unlink it if you want to set up a new TOTP.</p>

                {Unlink && (
                    <Unlink>
                        <button data-testid="unlink-totp-button" type="button">
                            Unlink TOTP
                        </button>
                    </Unlink>
                )}
            </div>
        )
    }

    const { Code, totpQrImageSrc, totpSecretKey, errors, isSubmitting, isValidating } = props

    return (
        <div data-testid="totp-form-unlinked">
            <h2>TOTP</h2>

            {totpQrImageSrc && <img src={totpQrImageSrc} alt="TOTP QR Code" />}
            {totpSecretKey && (
                <div>
                    Secret Key: <span data-testid="totp-secret-key">{totpSecretKey}</span>
                </div>
            )}

            {Code && (
                <Code>
                    <Input
                        data-testid="totp-code-input"
                        placeholder="Enter TOTP code"
                        disabled={isSubmitting || isValidating}
                    />
                </Code>
            )}

            <button data-testid="verify-totp-button" type="submit" disabled={isSubmitting || isValidating}>
                Verify TOTP
            </button>

            {errors && errors.length > 0 && (
                <div data-testid="totp-form-errors">
                    {errors.map(error => (
                        <div key={error.id}>{getErrorMessage(error)}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

function OidcForm({ Apple, Facebook, Google, isLoading }: settingsFlow.OidcFormProps) {
    if (isLoading) {
        return <p>Loading OIDC providers...</p>
    }

    return (
        <div data-testid="oidc-form">
            <h2>OIDC Providers</h2>

            {Apple && (
                <Apple>
                    <OidcButton data-testid="apple-oidc-button">Apple</OidcButton>
                </Apple>
            )}
            {Facebook && (
                <Facebook>
                    <OidcButton data-testid="facebook-oidc-button">Facebook</OidcButton>
                </Facebook>
            )}
            {Google && (
                <Google>
                    <OidcButton data-testid="google-oidc-button">Google</OidcButton>
                </Google>
            )}
        </div>
    )
}

function OidcButton({ oidcType, children, ...props }: settingsFlow.OidcButtonProps) {
    if (!oidcType) {
        throw new Error("OidcButton requires an oidcType prop")
    }

    return (
        <button type="button" {...props}>
            {children} ({oidcType})
        </button>
    )
}
