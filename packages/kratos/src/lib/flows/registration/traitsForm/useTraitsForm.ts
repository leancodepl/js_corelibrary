import { useForm } from "@tanstack/react-form"
import { instanceOfSuccessfulNativeRegistration, RegistrationFlowState } from "../../../kratos"
import { getCsrfToken, handleOnSubmitErrors, TraitsConfig } from "../../../utils"
import { useGetRegistrationFlow, useRegistrationFlowContext, useUpdateRegistrationFlow } from "../hooks"
import { OnRegistrationFlowError } from "../types"

type UsePasswordFormProps<TTraitsConfig extends TraitsConfig> = {
  traitsConfig: TTraitsConfig
  onError?: OnRegistrationFlowError<TTraitsConfig>
  onRegistrationSuccess?: () => void
}

export function useTraitsForm<TTraitsConfig extends TraitsConfig>({
  traitsConfig,
  onError,
  onRegistrationSuccess,
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
        onRegistrationSuccess?.()

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
