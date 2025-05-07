import { KratosRegistrationFlow, OnRegistrationFlowError, RegisterFormProps } from "@leancodepl/kratos"
import { createFileRoute } from "@tanstack/react-router"
import { AuthError, CommonCheckboxFieldProps, CommonInputFieldProps } from "packages/kratos/src/lib/utils"
import { FC, ReactNode } from "react"
import { z } from "zod"

const registrationSearchSchema = z.object({
    flow: z.string().optional(),
})

const handleError: OnRegistrationFlowError = ({ target, errors }) => {
    if (target === "root") {
        alert(`Błędy formularza: ${errors.map(e => e.id).join(", ")}`)
    } else {
        alert(`Błędy pola ${target}: ${errors.map(e => e.id).join(", ")}`)
    }
}

export const Route = createFileRoute("/registration")({
    component: RouteComponent,
    validateSearch: registrationSearchSchema,
})

function RouteComponent() {
    const { flow } = Route.useSearch()
    return (
        <KratosRegistrationFlow
            traitsDefaultValues={{ email: "", given_name: "", regulations_accepted: false }}
            registerForm={RegisterForm}
            initialFlowId={flow}
            onError={handleError}
            returnTo="https://host.local.lncd.pl/"
        />
    )
}

const getErrorMessage = (error: AuthError) => {
    switch (error.id) {
        case "Error_InvalidFormat":
            return "Nieprawidłowa wartość"
        case "Error_InvalidFormat_WithContext":
            return `Nieprawidłowa wartość: ${error.context.reason}`
        case "Error_MissingProperty":
            return "To pole jest wymagane"
        case "Error_MissingProperty_WithContext":
            return `Pole "${error.context.property}" jest wymagane`
        case "Error_TooShort_WithContext":
            return `Liczba znaków musi być większa niż ${error.context.min_length}`
        case "Error_TooShort":
            return "Wprowadzona wartość jest zbyt krótka"
        case "Error_InvalidPattern_WithContext":
            return `Wartość powinna mieć format: ${error.context.pattern}`
        case "Error_InvalidPattern":
            return "Wprowadzona wartość nie pasuje do wzorca"
        case "Error_PasswordPolicyViolation":
            return "Wprowadzone hasło nie może zostać użyte"
        case "Error_InvalidCredentials":
            return "Wprowadzone dane są nieprawidłowe, sprawdź literówki w adresie e-mail lub haśle"
        case "Error_MustBeEqualTo_WithContext":
            return `Wartość musi być: ${error.context.expected}`
        default:
            return error.originalError.text
    }
}

const Input: FC<CommonInputFieldProps & { placeholder?: string }> = ({ errors, ...props }) => (
    <div>
        <input {...props} />
        {errors && errors.length > 0 && (
            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        )}
    </div>
)

const Checkbox: FC<CommonCheckboxFieldProps & { placeholder?: string; children?: ReactNode }> = ({
    errors,
    children,
    ...props
}) => (
    <div>
        <label>
            <input {...props} />
            {children}
        </label>

        {errors && errors.length > 0 && (
            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        )}
    </div>
)

function RegisterForm({
    TraitInput,
    TraitCheckbox,
    Password,
    Google,
    Passkey,
    Apple,
    Facebook,
    errors,
}: RegisterFormProps) {
    return (
        <>
            {TraitInput && (
                <>
                    <TraitInput trait="email">
                        <Input placeholder="Email" />
                    </TraitInput>

                    <TraitInput trait="given_name">
                        <Input placeholder="Given name" />
                    </TraitInput>
                </>
            )}
            {Password && (
                <Password>
                    <Input placeholder="Password" />
                </Password>
            )}
            {TraitCheckbox && (
                <TraitCheckbox trait="regulations_accepted">
                    <Checkbox type="checkbox" placeholder="Regulations accepted">
                        I accept the regulations
                    </Checkbox>
                </TraitCheckbox>
            )}

            <button type="submit">Register</button>

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

            <div>{errors?.map(error => <div key={error.id}>{getErrorMessage(error)}</div>)}</div>
        </>
    )
}
