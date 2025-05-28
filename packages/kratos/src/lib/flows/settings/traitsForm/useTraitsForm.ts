import { useForm } from "@tanstack/react-form"
import { SettingsFlowState } from "../../../kratos"
import { getCsrfToken, handleOnSubmitErrors } from "../../../utils"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../hooks"
import { OnSettingsFlowError, TraitsConfig } from "../types"

type UsePasswordFormProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    onError?: OnSettingsFlowError
    onChangeTraitsSuccess?: () => void
}

export function useTraitsForm<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    onError,
    onChangeTraitsSuccess,
}: UsePasswordFormProps<TTraitsConfig>) {
    const { mutateAsync: updateSettingsFlow } = useUpdateSettingsFlow()
    const { data: settingsFlow } = useGetSettingsFlow()

    return useForm({
        defaultValues: {
            traits: (settingsFlow?.identity.traits ??
                Object.fromEntries(
                    Object.values(traitsConfig).map(({ trait, type }) => [trait, type === "boolean" ? false : ""]),
                )) as Record<string, boolean | string>,
        },
        onSubmit: async ({ value, formApi }) => {
            if (!settingsFlow) return

            const response = await updateSettingsFlow({
                csrf_token: getCsrfToken(settingsFlow),
                method: "profile",
                traits: value.traits ?? {},
            })

            if (!response) {
                return
            }

            if (response.state === SettingsFlowState.Success) {
                onChangeTraitsSuccess?.()

                return
            }

            handleOnSubmitErrors(response, formApi, onError)
        },
    })
}
