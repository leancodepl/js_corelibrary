import { useMemo } from "react"
import { useForm } from "@tanstack/react-form"
import { instanceOfSuccessfulNativeLogin } from "../../../kratos"
import { getCsrfToken, getNodeById, handleOnSubmitErrors } from "../../../utils"
import { useGetLoginFlow, useUpdateLoginFlow } from "../hooks"
import { OnLoginFlowError } from "../types"
import { InputFields } from "./types"

type UsePasswordFormProps = {
    onError?: OnLoginFlowError
    onLoginSuccess?: () => void
}

export function usePasswordForm({ onError, onLoginSuccess }: UsePasswordFormProps) {
    const { mutateAsync: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    const existingIdentifierFromFlow = useMemo(() => {
        if (!loginFlow) return undefined

        const node = getNodeById(loginFlow.ui.nodes, "identifier")

        if (!node || node.attributes.node_type !== "input") {
            return undefined
        }

        return typeof node.attributes.value === "string" ? node.attributes.value : undefined
    }, [loginFlow])

    return useForm({
        defaultValues: {
            [InputFields.Identifier]: existingIdentifierFromFlow ?? "",
            [InputFields.Password]: "",
        } satisfies Record<InputFields, string>,
        onSubmit: async ({ value, formApi }) => {
            if (!loginFlow) return

            const response = await updateLoginFlow({
                csrf_token: getCsrfToken(loginFlow),
                method: "password",
                identifier: value[InputFields.Identifier],
                password: value[InputFields.Password],
            })

            if (!response) {
                return
            }

            if (instanceOfSuccessfulNativeLogin(response)) {
                onLoginSuccess?.()

                return
            }

            handleOnSubmitErrors(response, formApi, onError)
        },
    })
}
