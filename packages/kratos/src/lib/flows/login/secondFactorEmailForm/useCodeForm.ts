import { useForm } from "@tanstack/react-form"
import { getCsrfToken, getNodeById, inputNodeAttributes } from "../../../utils"
import { useGetLoginFlow } from "../hooks"
import { useUpdateLoginFlow } from "../hooks/useUpdateLoginFlow"

export function useCodeForm() {
    const { mutate: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    return useForm({
        defaultValues: { code: "" },
        onSubmit: ({ value }) => {
            if (!loginFlow) return

            const identifier = inputNodeAttributes(getNodeById(loginFlow.ui.nodes, "identifier"))?.value

            updateLoginFlow({
                csrf_token: getCsrfToken(loginFlow),
                method: "code",
                code: value.code,
                identifier,
            })
        },
    })
}
