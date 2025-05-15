import { ComponentType, ReactNode, useMemo } from "react"
import { AuthError, getAuthErrorsFromFormErrorMap } from "../../../utils"
import { OnRegistrationFlowError, TraitsConfig } from "../types"
import { Apple, Facebook, Google, TraitCheckbox, TraitInput } from "./fields"
import { TraitsFormProvider } from "./traitsFormContext"
import { useTraitsForm } from "./useTraitsForm"

type TraitsComponents<TTraitsConfig extends TraitsConfig> = {
    [K in keyof TTraitsConfig]: TTraitsConfig[K] extends { type: "string" }
        ? ComponentType<Omit<typeof TraitInput, "trait">>
        : TTraitsConfig[K] extends { type: "boolean" }
          ? ComponentType<Omit<typeof TraitCheckbox, "trait">>
          : never
}

export type TraitsFormProps<TTraitsConfig extends TraitsConfig> = TraitsComponents<TTraitsConfig> & {
    Google?: ComponentType<{ children: ReactNode }>
    Apple?: ComponentType<{ children: ReactNode }>
    Facebook?: ComponentType<{ children: ReactNode }>
    errors: Array<AuthError>
}

type TraitsFormWrapperProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    traitsForm: ComponentType<TraitsFormProps<TTraitsConfig>>
    onError?: OnRegistrationFlowError
    onRegisterationSuccess?: () => void
}

export function TraitsFormWrapper<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    traitsForm: TraitsForm,
    onError,
    onRegisterationSuccess,
}: TraitsFormWrapperProps<TTraitsConfig>) {
    const traitsForm = useTraitsForm({ traitsConfig, onError, onRegisterationSuccess })
    const formErrors = useMemo(
        () => getAuthErrorsFromFormErrorMap(traitsForm.state.errorMap),
        [traitsForm.state.errorMap],
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
        <TraitsFormProvider traitsForm={traitsForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    traitsForm.handleSubmit()
                }}>
                <TraitsForm
                    Apple={Apple}
                    errors={formErrors}
                    Facebook={Facebook}
                    Google={Google}
                    {...traitComponents}
                />
            </form>
        </TraitsFormProvider>
    )
}
