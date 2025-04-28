import {
    ChooseMethodFormProps,
    KratosLoginFlow,
    SecondFactorEmailFormProps,
    SecondFactorFormProps,
} from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { CommonInputFieldProps, FormError } from "packages/kratos/src/lib/utils"
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
const getErrorMessage = (error: FormError) => {
    switch (error.id) {
        case 4000001:
            return "Nieprawidłowa wartość"
        case 4000002:
            return "To pole jest wymagane"
        case 4000003:
            if (error.context && "min_length" in error.context && "actual_length" in error.context) {
                return `Liczba znaków musi być większa niż ${error.context.min_length}, a wprowadzono ${error.context.actual_length}`
            }
            return "Wprowadzona wartość jest zbyt krótka"
        case 4000004:
            if (error.context && "pattern" in error.context) {
                return `Wartość powinna mieć format: ${error.context.pattern}`
            }
            return "Wprowadzona wartość nie pasuje do wzorca"
        case 4000005:
            return "Wprowadzone hasło nie może zostać użyte"
        case 4000006:
            return "Wprowadzone dane są nieprawidłowe, sprawdź literówki w adresie e-mail lub haśle"
        default:
            return error.text
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

function SecondFactorForm({ Totp, Email }: SecondFactorFormProps) {
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
        </>
    )
}

function SecondFactorEmailForm({ Code, Resend }: SecondFactorEmailFormProps) {
    return (
        <>
            <Code>
                <input />
            </Code>

            <button type="submit">Login</button>

            <Resend>
                <button>Resend code</button>
            </Resend>
        </>
    )
}
