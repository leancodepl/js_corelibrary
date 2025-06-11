import { useForm } from "@tanstack/react-form"
import { useRegistrationFlowContext } from ".."
import { instanceOfSuccessfulNativeRegistration, RegistrationFlowState } from "../../../kratos"
import { handleOnSubmitErrors, TraitsConfig } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetRegistrationFlow } from "../hooks"
import { useUpdateRegistrationFlow } from "../hooks/useUpdateRegistrationFlow"
import { OnRegistrationFlowError } from "../types"
import { InputFields } from "./types"

type UseChooseMethodFormProps<TTraitsConfig extends TraitsConfig> = {
    onError?: OnRegistrationFlowError<TTraitsConfig>
    onRegistrationSuccess?: () => void
}

export function useChooseMethodForm<TTraitsConfig extends TraitsConfig>({
    onError,
    onRegistrationSuccess,
}: UseChooseMethodFormProps<TTraitsConfig>) {
    const { setTraitsFormCompleted, traits } = useRegistrationFlowContext()
    const { mutateAsync: updateRegistrationFlow } = useUpdateRegistrationFlow()
    const { data: registrationFlow } = useGetRegistrationFlow()

    return useForm({
        defaultValues: {
            [InputFields.Password]: "",
            [InputFields.PasswordConfirmation]: "",
        },
        onSubmit: async ({ value, formApi }) => {
            if (!registrationFlow) return

            const response = await updateRegistrationFlow({
                csrf_token: getCsrfToken(registrationFlow),
                method: "password",
                traits: traits ?? {},
                password: value[InputFields.Password],
            })

            if (!response) {
                return
            }

            if (instanceOfSuccessfulNativeRegistration(response)) {
                onRegistrationSuccess?.()

                return
            }

            if (response.state === RegistrationFlowState.ChooseMethod) {
                setTraitsFormCompleted(true)
            }

            handleOnSubmitErrors(response, formApi, onError)
        },
    })
}
