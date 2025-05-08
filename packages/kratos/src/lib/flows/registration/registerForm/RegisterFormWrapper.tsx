import { ComponentType, ReactNode, useMemo } from "react"
import { AuthError, getAuthErrorsFromFormErrorMap } from "../../../utils"
import { OnRegistrationFlowError, TraitsConfig } from "../types"
import { Apple, Facebook, Google, Password, TraitCheckbox, TraitInput } from "./fields"
import { RegisterFormProvider } from "./registerFormContext"
import { usePasswordForm } from "./usePasswordForm"

type TraitsComponents<TTraitsConfig extends TraitsConfig> = {
    [K in keyof TTraitsConfig]: TTraitsConfig[K] extends { type: "string" }
        ? ComponentType<Omit<typeof TraitInput, "trait">>
        : TTraitsConfig[K] extends { type: "boolean" }
          ? ComponentType<Omit<typeof TraitCheckbox, "trait">>
          : never
}

export type RegisterFormProps<TTraitsConfig extends TraitsConfig> = TraitsComponents<TTraitsConfig> & {
    Password?: ComponentType<{ children: ReactNode }>
    Google?: ComponentType<{ children: ReactNode }>
    Passkey?: ComponentType<{ children: ReactNode }>
    Apple?: ComponentType<{ children: ReactNode }>
    Facebook?: ComponentType<{ children: ReactNode }>
    errors: Array<AuthError>
}

type RegisterFormWrapperProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    registerForm: ComponentType<RegisterFormProps<TTraitsConfig>>
    onError?: OnRegistrationFlowError
}

export function RegisterFormWrapper<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    registerForm: RegisterForm,
    onError,
}: RegisterFormWrapperProps<TTraitsConfig>) {
    const passwordForm = usePasswordForm({ traitsConfig, onError })
    const formErrors = useMemo(
        () => getAuthErrorsFromFormErrorMap(passwordForm.state.errorMap),
        [passwordForm.state.errorMap],
    )

    const traitComponents = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(traitsConfig).map(([key, value]) => {
                    return [
                        key,
                        value.type === "boolean"
                            ? ({ children }: { children: ReactNode }) => (
                                  <TraitCheckbox children={children} trait={value.trait} />
                              )
                            : ({ children }: { children: ReactNode }) => (
                                  <TraitInput children={children} trait={value.trait} />
                              ),
                    ]
                }),
            ) as TraitsComponents<TTraitsConfig>,
        [traitsConfig],
    )

    return (
        <RegisterFormProvider passwordForm={passwordForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    passwordForm.handleSubmit()
                }}>
                <RegisterForm
                    Apple={Apple}
                    errors={formErrors}
                    Facebook={Facebook}
                    Google={Google}
                    Password={Password}
                    {...traitComponents}
                />
            </form>
        </RegisterFormProvider>
    )
}
