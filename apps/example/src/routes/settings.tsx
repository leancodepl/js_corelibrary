import { z } from "zod"
import { settingsFlow } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { Input } from "../components/Input"
import { AuthTraitsConfig, getErrorMessage, SettingsFlow } from "../services/kratos"

const settingsSearchSchema = z.object({
    flow: z.string().optional(),
})

const handleError: settingsFlow.OnSettingsFlowError = ({ target, errors }) => {
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
    const { flow } = Route.useSearch()

    return (
        <SettingsFlow
            traitsForm={TraitsForm}
            newPasswordForm={NewPasswordForm}
            passkeysForm={PasskeysForm}
            totpForm={TotpForm}
            oidcForm={OidcForm}
            settingsForm={({
                emailVerificationRequired,
                newPasswordFormWrapper,
                traitsFormWrapper,
                passkeysFormWrapper,
                totpFormWrapper,
                oidcFormWrapper,
            }) => {
                return (
                    <div style={emailVerificationRequired ? { backgroundColor: "#f8d7da" } : {}}>
                        {traitsFormWrapper}
                        {newPasswordFormWrapper}
                        {passkeysFormWrapper}
                        {totpFormWrapper}
                        {oidcFormWrapper}
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

function TotpForm({
    Code,
    Unlink,
    totpQrImageSrc,
    totpSecretKey,
    errors,
    isSubmitting,
    isValidating,
    isTotpLinked,
}: settingsFlow.TotpFormProps) {
    return (
        <div>
            <h2>TOTP</h2>

            {isTotpLinked === true && (
                <>
                    {Unlink && (
                        <Unlink>
                            <button type="button" disabled={isSubmitting || isValidating}>
                                Unlink TOTP
                            </button>
                        </Unlink>
                    )}
                </>
            )}

            {isTotpLinked === false && (
                <>
                    {totpQrImageSrc && <img src={totpQrImageSrc} alt="TOTP QR Code" />}
                    {totpSecretKey && <div>Secret Key: {totpSecretKey}</div>}

                    {Code && (
                        <Code>
                            <Input
                                placeholder="Enter TOTP code"
                                type="password"
                                disabled={isSubmitting || isValidating}
                            />
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
                </>
            )}
        </div>
    )
}

function OidcForm({ Apple, Facebook, Google, UnlinkApple, UnlinkFacebook, UnlinkGoogle }: settingsFlow.OidcFormProps) {
    return (
        <div>
            <h2>OIDC Providers</h2>

            {Apple && (
                <Apple>
                    <button type="button">Link Apple</button>
                </Apple>
            )}
            {Facebook && (
                <Facebook>
                    <button type="button">Link Facebook</button>
                </Facebook>
            )}
            {Google && (
                <Google>
                    <button type="button">Link Google</button>
                </Google>
            )}

            {UnlinkApple && (
                <UnlinkApple>
                    <button type="button">Unlink Apple</button>
                </UnlinkApple>
            )}
            {UnlinkFacebook && (
                <UnlinkFacebook>
                    <button type="button">Unlink Facebook</button>
                </UnlinkFacebook>
            )}
            {UnlinkGoogle && (
                <UnlinkGoogle>
                    <button type="button">Unlink Google</button>
                </UnlinkGoogle>
            )}
        </div>
    )
}
