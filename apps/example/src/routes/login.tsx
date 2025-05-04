import {
    ChooseMethodFormProps,
    KratosLoginFlow,
    SecondFactorEmailFormProps,
    SecondFactorFormProps,
} from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { AuthError, CommonInputFieldProps } from "packages/kratos/src/lib/utils"
import { FC } from "react"
import { z } from "zod"

const loginSearchSchema = z.object({
    flow: z.string().optional(),
})

export const Route = createFileRoute("/login")({
    component: RouteComponent,
    validateSearch: loginSearchSchema,
})

function RouteComponent() {
    const { flow } = Route.useSearch()
    return (
        <KratosLoginFlow
            chooseMethodForm={ChooseMethodForm}
            secondFactorForm={SecondFactorForm}
            secondFactorEmailForm={SecondFactorEmailForm}
            initialFlowId={flow}
        />
    )
}

// https://www.ory.sh/docs/kratos/concepts/ui-user-interface#machine-readable-format
// https://github.com/ory/docs/blob/master/docs/kratos/concepts/messages.json
const getErrorMessage = (error: AuthError) => {
    switch (error.id) {
        case "Error_GenericInvalidFormat":
            return "Nieprawidłowa wartość"
        case "Error_MissingProperty":
            return "To pole jest wymagane"
        case "Error_TooShort":
            return error.context
                ? `Liczba znaków musi być większa niż ${error.context.min_length}`
                : "Wprowadzona wartość jest zbyt krótka"
        case "Error_InvalidPattern":
            return error.context
                ? `Wartość powinna mieć format: ${error.context.pattern}`
                : "Wprowadzona wartość nie pasuje do wzorca"
        case "Error_PasswordPolicyViolation":
            return "Wprowadzone hasło nie może zostać użyte"
        case "Error_InvalidCredentials":
            return "Wprowadzone dane są nieprawidłowe, sprawdź literówki w adresie e-mail lub haśle"
        default:
            return error.originalError.text
    }
}

const Input: FC<CommonInputFieldProps & { placeholder?: string }> = ({ errors, ...props }) => (
    <div>
        <input {...props} />
        {errors && errors.length > 0 && (
            <div>
                {errors.map((error, index) => (
                    <div key={index}>
                        {error.id}: {getErrorMessage(error)}
                    </div>
                ))}
            </div>
        )}
    </div>
)

function ChooseMethodForm({
    Identifier,
    Password,
    Google,
    Passkey,
    Apple,
    Facebook,
    formErrors,
}: ChooseMethodFormProps) {
    return (
        <>
            {Identifier && (
                <Identifier>
                    <Input placeholder="Identifier" />
                </Identifier>
            )}
            {Password && (
                <Password>
                    <Input placeholder="Password" />
                </Password>
            )}

            <button type="submit">Login</button>

            {Google && (
                <Google>
                    <button>Sign in with Google</button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button>Sign in with Apple</button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button>Sign in with Facebook</button>
                </Facebook>
            )}

            {Passkey && (
                <Passkey>
                    <button>Sign in with Passkey</button>
                </Passkey>
            )}

            <div>
                {formErrors && formErrors.length > 0 && (
                    <div>
                        {formErrors.map((error, index) => (
                            <div key={index}>
                                {error.id}: {getErrorMessage(error)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

function SecondFactorForm({ Totp, Email, formErrors }: SecondFactorFormProps) {
    return (
        <>
            {Totp && (
                <Totp>
                    <input />
                </Totp>
            )}

            <button type="submit">Login</button>

            {Email && (
                <Email>
                    <button>Continue with email</button>
                </Email>
            )}

            <div>
                {formErrors && formErrors.length > 0 && (
                    <div>
                        {formErrors.map((error, index) => (
                            <div key={index}>
                                {error.id}: {getErrorMessage(error)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

function SecondFactorEmailForm({ Code, Resend, formErrors }: SecondFactorEmailFormProps) {
    return (
        <>
            <Code>
                <input />
            </Code>

            <button type="submit">Login</button>

            <Resend>
                <button>Resend code</button>
            </Resend>

            <div>
                {formErrors && formErrors.length > 0 && (
                    <div>
                        {formErrors.map((error, index) => (
                            <div key={index}>
                                {error.id}: {getErrorMessage(error)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
