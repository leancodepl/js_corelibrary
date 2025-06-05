import { z } from "zod"
import { settingsFlow } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { Input } from "../components/Input"
import { AuthTraitsConfig, getErrorMessage, SettingsFlow, useIsLoggedIn } from "../services/kratos"

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
    const isLoggedIn = useIsLoggedIn()
    const { flow } = Route.useSearch()

    if (isLoggedIn === undefined) {
        return <p>Loading settings page...</p>
    }

    if (!isLoggedIn) {
        return <p>You must be logged in to access settings.</p>
    }

    return (
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
        />
    )
}

function TraitsForm({
    errors,
    Email,
    GivenName,
    isSubmitting,
    isValidating,
    emailVerificationRequired,
}: settingsFlow.TraitsFormProps<AuthTraitsConfig>) {
    return (
        <div>
            <h2>Traits</h2>

            {emailVerificationRequired && (
                <div>
                    <h2>Email verification required</h2>
                    <p>Please verify your email address to continue.</p>
                </div>
            )}

            {Email && (
                <Email>
                    <Input placeholder="Email" disabled={emailVerificationRequired || isSubmitting || isValidating} />
                </Email>
            )}

            {GivenName && (
                <GivenName>
                    <Input placeholder="First name" disabled={isSubmitting || isValidating} />
                </GivenName>
            )}

            <button type="submit" disabled={isSubmitting || isValidating}>
                Update
            </button>

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </div>
    )
}

function NewPasswordForm({
    errors,
    Password,
    PasswordConfirmation,
    isSubmitting,
    isValidating,
}: settingsFlow.NewPasswordFormProps) {
    return (
        <div>
            <h2>New password</h2>

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
                Set new password
            </button>

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </div>
    )
}

function PasskeysForm({ addNewPasskey, existingPasskeys, isPending }: settingsFlow.PasskeysFormProps) {
    return (
        <div>
            <h2>Passkeys</h2>

            {addNewPasskey && (
                <button disabled={isPending} onClick={addNewPasskey}>
                    Add new passkey
                </button>
            )}

            <div>
                <h3>Existing Passkeys</h3>

                {existingPasskeys.map(passkey => (
                    <div key={passkey.id}>
                        <strong>{passkey.name} </strong>
                        <span>({new Date(passkey.addedAtUnix * 1000).toLocaleString()}) </span>
                        <button onClick={passkey.removePasskey} disabled={isPending}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function TotpForm(props: settingsFlow.TotpFormProps) {
    if (props.isTotpLinked) {
        const { Unlink } = props

        return (
            <div>
                <h2>TOTP is already linked</h2>
                <p>You can unlink it if you want to set up a new TOTP.</p>

                {Unlink && (
                    <Unlink>
                        <button type="button">Unlink TOTP</button>
                    </Unlink>
                )}
            </div>
        )
    }

    const { Code, totpQrImageSrc, totpSecretKey, errors, isSubmitting, isValidating } = props

    return (
        <div>
            <h2>TOTP</h2>

            {totpQrImageSrc && <img src={totpQrImageSrc} alt="TOTP QR Code" />}
            {totpSecretKey && <div>Secret Key: {totpSecretKey}</div>}

            {Code && (
                <Code>
                    <Input placeholder="Enter TOTP code" type="password" disabled={isSubmitting || isValidating} />
                </Code>
            )}

            <button type="submit" disabled={isSubmitting || isValidating}>
                Verify TOTP
            </button>

            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        </div>
    )
}

function OidcForm({ Apple, Facebook, Google }: settingsFlow.OidcFormProps) {
    return (
        <div>
            <h2>OIDC Providers</h2>

            {Apple && (
                <Apple>
                    <OidcButton>Apple</OidcButton>
                </Apple>
            )}
            {Facebook && (
                <Facebook>
                    <OidcButton>Facebook</OidcButton>
                </Facebook>
            )}
            {Google && (
                <Google>
                    <OidcButton>Google</OidcButton>
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
