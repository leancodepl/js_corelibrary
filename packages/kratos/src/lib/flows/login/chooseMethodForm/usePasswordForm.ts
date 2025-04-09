import { useForm } from "@tanstack/react-form"
import { getCsrfToken } from "../../../utils/flow"
import { useGetLoginFlow } from "../hooks"
import { useUpdateLoginFlow } from "../hooks/useUpdateLoginFlow"

export function usePasswordForm() {
    const { mutate: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    return useForm({
        defaultValues: { identifier: "", password: "" },
        onSubmit: ({ value }) => {
            if (!loginFlow) return

            updateLoginFlow({
                csrf_token: getCsrfToken(loginFlow),
                method: "password",
                identifier: value.identifier,
                password: value.password,
            })
        },
    })
}
