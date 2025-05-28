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
            settingsForm={({
                emailVerificationRequired,
                newPasswordFormWrapper,
                traitsFormWrapper,
                passkeysFormWrapper,
            }) => {
                return (
                    <div style={emailVerificationRequired ? { backgroundColor: "#f8d7da" } : {}}>
                        {traitsFormWrapper}
                        {newPasswordFormWrapper}
                        {passkeysFormWrapper}
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

function PasskeysForm({ AddPasskey, existingPasskeys, isRemoving }: settingsFlow.PasskeysFormProps) {
    return (
        <div>
            <h2>Passkeys</h2>

            {AddPasskey && (
                <AddPasskey>
                    <button disabled={isRemoving}>Add new passkey</button>
                </AddPasskey>
            )}

            <div>
                <h3>Existing Passkeys</h3>

                {existingPasskeys.map(passkey => (
                    <div key={passkey.id}>
                        <strong>{passkey.name} </strong>
                        <span>({new Date(passkey.addedAtUnix * 1000).toLocaleString()}) </span>
                        <button onClick={passkey.removePasskey} disabled={isRemoving}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
