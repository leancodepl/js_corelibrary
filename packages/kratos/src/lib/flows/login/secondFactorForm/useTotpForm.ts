import { useForm } from "@tanstack/react-form"
import { getCsrfToken } from "../../../utils/flow"
import { useGetLoginFlow } from "../hooks"
import { useUpdateLoginFlow } from "../hooks/useUpdateLoginFlow"

export function useTotpForm() {
    const { mutate: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    return useForm({
        defaultValues: { totp_code: "" },
        onSubmit: ({ value }) => {
            if (!loginFlow) return

            updateLoginFlow({
                csrf_token: getCsrfToken(loginFlow),
                method: "totp",
                totp_code: value.totp_code,
            })
        },
    })
}
