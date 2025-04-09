import {
    ChooseMethodFormProps,
    KratosLoginFlow,
    SecondFactorEmailFormProps,
    SecondFactorFormProps,
} from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
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

function ChooseMethodForm({ Identifier, Password, Google, Passkey, Apple, Facebook }: ChooseMethodFormProps) {
    return (
        <>
            {Identifier && (
                <Identifier>
                    <input />
                </Identifier>
            )}
            {Password && (
                <Password>
                    <input />
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
