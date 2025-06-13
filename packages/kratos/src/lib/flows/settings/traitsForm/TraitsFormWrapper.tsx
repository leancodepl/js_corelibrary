import { ComponentType, ReactNode, useMemo } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError, TraitsConfig } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
import { OnSettingsFlowError } from "../types"
import { TraitCheckbox, TraitInput } from "./fields"
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
    errors: Array<AuthError>
    isSubmitting: boolean
    isValidating: boolean
    emailVerificationRequired: boolean
}

type TraitsFormWrapperProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    traitsForm: ComponentType<TraitsFormProps<TTraitsConfig>>
    emailVerificationRequired: boolean
    onError?: OnSettingsFlowError<TTraitsConfig>
    onChangeTraitsSuccess?: () => void
}

export function TraitsFormWrapper<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    traitsForm: TraitsForm,
    emailVerificationRequired,
    onError,
    onChangeTraitsSuccess,
}: TraitsFormWrapperProps<TTraitsConfig>) {
    const { data: settingsFlow } = useGetSettingsFlow()
    const traitsForm = useTraitsForm({ traitsConfig, onError, onChangeTraitsSuccess })
    const formErrors = useFormErrors(traitsForm)

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

    if (!settingsFlow) {
        return null
    }

    return (
        <TraitsFormProvider traitsForm={traitsForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    traitsForm.handleSubmit()
                }}>
                <TraitsForm
                    emailVerificationRequired={emailVerificationRequired}
                    errors={formErrors}
                    isSubmitting={traitsForm.state.isSubmitting}
                    isValidating={traitsForm.state.isValidating}
                    {...traitComponents}
                />
            </form>
        </TraitsFormProvider>
    )
}
