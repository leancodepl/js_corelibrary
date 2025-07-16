import { dataTestIds } from "@example/e2e-ids"
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
        return <p data-testid={dataTestIds.settings.loading}>Loading settings page...</p>
    }

    if (!isLoggedIn) {
        return <p data-testid={dataTestIds.settings.notLoggedIn}>You must be logged in to access settings.</p>
    }

    return (
        <div data-testid={dataTestIds.settings.page}>
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
        return <p data-testid={dataTestIds.settings.traitsForm.loading}>Loading traits form...</p>
    }

    return (
        <div data-testid={dataTestIds.settings.traitsForm.wrapper}>
            <h2>Traits</h2>

            {emailVerificationRequired && (
                <div data-testid={dataTestIds.settings.traitsForm.emailVerificationRequiredInfo}>
                    <h2>Email verification required</h2>
                    <p>Please verify your email address to continue.</p>
                </div>
            )}

            {Email && (
                <Email>
                    <Input
                        data-testid={dataTestIds.settings.traitsForm.emailInput}
                        placeholder="Email"
                        disabled={emailVerificationRequired || isSubmitting || isValidating}
                    />
                </Email>
            )}

            {GivenName && (
                <GivenName>
                    <Input
                        data-testid={dataTestIds.settings.traitsForm.givenNameInput}
                        placeholder="First name"
                        disabled={isSubmitting || isValidating}
                    />
                </GivenName>
            )}

            <button
                data-testid={dataTestIds.settings.traitsForm.updateButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
                Update
            </button>

            {errors && errors.length > 0 && (
                <div data-testid={dataTestIds.settings.traitsForm.errors}>
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
        return <p data-testid={dataTestIds.settings.newPasswordForm.loading}>Loading new password form...</p>
    }

    return (
        <div data-testid={dataTestIds.settings.newPasswordForm.wrapper}>
            <h2>New password</h2>

            {Password && (
                <Password>
                    <Input
                        data-testid={dataTestIds.settings.newPasswordForm.passwordInput}
                        placeholder="Password"
                        disabled={isSubmitting || isValidating}
                    />
                </Password>
            )}
            {PasswordConfirmation && (
                <PasswordConfirmation>
                    <Input
                        data-testid={dataTestIds.settings.newPasswordForm.passwordConfirmationInput}
                        placeholder="Password confirmation"
                        disabled={isSubmitting || isValidating}
                    />
                </PasswordConfirmation>
            )}

            <button
                data-testid={dataTestIds.settings.newPasswordForm.submitButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
                Set new password
            </button>

            {errors && errors.length > 0 && (
                <div data-testid={dataTestIds.settings.newPasswordForm.errors}>
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
        return <p data-testid={dataTestIds.settings.passkeysForm.loading}>Loading passkeys...</p>
    }

    return (
        <div data-testid={dataTestIds.settings.passkeysForm.wrapper}>
            <h2>Passkeys</h2>

            {addNewPasskey && (
                <button
                    data-testid={dataTestIds.settings.passkeysForm.addNewButton}
                    disabled={isPending}
                    onClick={addNewPasskey}>
                    Add new passkey
                </button>
            )}

            <div data-testid={dataTestIds.settings.passkeysForm.existingPasskeys}>
                <h3>Existing Passkeys</h3>

                {existingPasskeys.map(passkey => (
                    <div data-testid={dataTestIds.settings.passkeysForm.existingPasskey} key={passkey.id}>
                        <strong>{passkey.name} </strong>
                        <span>({new Date(passkey.addedAtUnix * 1000).toLocaleString()}) </span>
                        <button
                            data-testid={dataTestIds.settings.passkeysForm.removeButton}
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
        return <p data-testid={dataTestIds.settings.totpForm.loading}>Loading TOTP form...</p>
    }

    if (props.isTotpLinked) {
        const { Unlink } = props

        return (
            <div data-testid={dataTestIds.settings.totpForm.wrapperLinked}>
                <h2>TOTP is already linked</h2>
                <p>You can unlink it if you want to set up a new TOTP.</p>

                {Unlink && (
                    <Unlink>
                        <button data-testid={dataTestIds.settings.totpForm.unlinkButton} type="button">
                            Unlink TOTP
                        </button>
                    </Unlink>
                )}
            </div>
        )
    }

    const { Code, totpQrImageSrc, totpSecretKey, errors, isSubmitting, isValidating } = props

    return (
        <div data-testid={dataTestIds.settings.totpForm.wrapperUnlinked}>
            <h2>TOTP</h2>

            {totpQrImageSrc && <img src={totpQrImageSrc} alt="TOTP QR Code" />}
            {totpSecretKey && (
                <div>
                    Secret Key: <span data-testid={dataTestIds.settings.totpForm.secretKey}>{totpSecretKey}</span>
                </div>
            )}

            {Code && (
                <Code>
                    <Input
                        data-testid={dataTestIds.settings.totpForm.codeInput}
                        placeholder="Enter TOTP code"
                        disabled={isSubmitting || isValidating}
                    />
                </Code>
            )}

            <button
                data-testid={dataTestIds.settings.totpForm.verifyButton}
                type="submit"
                disabled={isSubmitting || isValidating}>
                Verify TOTP
            </button>

            {errors && errors.length > 0 && (
                <div data-testid={dataTestIds.settings.totpForm.errors}>
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
        <div data-testid={dataTestIds.settings.oidcForm.wrapper}>
            <h2>OIDC Providers</h2>

            {Apple && (
                <Apple>
                    <OidcButton data-testid={dataTestIds.settings.oidcForm.appleButton}>Apple</OidcButton>
                </Apple>
            )}
            {Facebook && (
                <Facebook>
                    <OidcButton data-testid={dataTestIds.settings.oidcForm.facebookButton}>Facebook</OidcButton>
                </Facebook>
            )}
            {Google && (
                <Google>
                    <OidcButton data-testid={dataTestIds.settings.oidcForm.googleButton}>Google</OidcButton>
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
