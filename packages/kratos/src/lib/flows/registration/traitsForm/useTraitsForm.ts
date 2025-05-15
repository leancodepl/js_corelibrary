import { useForm } from "@tanstack/react-form"
import { useRegistrationFlowContext } from ".."
import { instanceOfSuccessfulNativeRegistration, RegistrationFlowState } from "../../../kratos"
import { handleOnSubmitErrors } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetRegistrationFlow } from "../hooks"
import { useUpdateRegistrationFlow } from "../hooks/useUpdateRegistrationFlow"
import { OnRegistrationFlowError, TraitsConfig } from "../types"

type UsePasswordFormProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    onError?: OnRegistrationFlowError
    onRegisterationSuccess?: () => void
}

export function useTraitsForm<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    onError,
    onRegisterationSuccess,
}: UsePasswordFormProps<TTraitsConfig>) {
    const { setTraitsFormCompleted, setTraits, traits } = useRegistrationFlowContext()
    const { mutateAsync: updateRegistrationFlow } = useUpdateRegistrationFlow()
    const { data: registrationFlow } = useGetRegistrationFlow()

    return useForm({
        defaultValues: {
            traits:
                traits ??
                Object.fromEntries(
                    Object.values(traitsConfig).map(({ trait, type }) => [trait, type === "boolean" ? false : ""]),
                ),
        },
        onSubmit: async ({ value, formApi }) => {
            if (!registrationFlow) return

            const response = await updateRegistrationFlow({
                csrf_token: getCsrfToken(registrationFlow),
                method: "profile",
                traits: value.traits ?? {},
            })

            if (!response) {
                return
            }

            if (instanceOfSuccessfulNativeRegistration(response)) {
                onRegisterationSuccess?.()

                return
            }

            if (
                response.state === RegistrationFlowState.ChooseMethod &&
                // "Please choose a credential to authenticate yourself with."
                response.ui.messages?.some(({ id }) => id === 1040009)
            ) {
                setTraits(value.traits)
                setTraitsFormCompleted(true)
            }

            handleOnSubmitErrors(response, formApi, onError)
        },
    })
}
