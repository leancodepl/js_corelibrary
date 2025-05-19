import { ComponentType, ReactNode, useCallback, useMemo } from "react"
import * as Slot from "@radix-ui/react-slot"
import { useQuery } from "@tanstack/react-query"
import { instanceOfSuccessfulNativeLogin } from "../../../../kratos"
import {
    CommonButtonProps,
    getCsrfToken,
    getNodeById,
    handleOnSubmitErrors,
    inputNodeAttributes,
} from "../../../../utils"
import { passkeyLogin, passkeyLoginInit } from "../../../../utils/passkeys"
import { useGetLoginFlow, useUpdateLoginFlow } from "../../hooks"
import { useChooseMethodFormContext } from "../chooseMethodFormContext"

type PasskeyProps = {
    children: ReactNode
}

export function Passkey({ children }: PasskeyProps) {
    const { mutateAsync: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()
    const { passwordForm } = useChooseMethodFormContext()

    const signInWithPasskeyUsingCredential = useCallback(
        async (credential: string) => {
            if (!loginFlow) return

            const response = await updateLoginFlow({
                method: "passkey",
                csrf_token: getCsrfToken(loginFlow),
                passkey_login: credential,
            })

            if (!response) {
                return
            }

            if (instanceOfSuccessfulNativeLogin(response)) {
                return
            }

            handleOnSubmitErrors(response, passwordForm, () => {})
        },
        [loginFlow, passwordForm, updateLoginFlow],
    )

    const challenge = useMemo(
        () => inputNodeAttributes(getNodeById(loginFlow?.ui.nodes, "passkey_challenge")),
        [loginFlow?.ui.nodes],
    )

    useQuery({
        queryKey: ["leancode_kratos_passkey", challenge?.value],
        queryFn: async ({ signal }) => {
            if (!challenge) throw new Error("No challenge provided")

            const credential = await passkeyLoginInit(challenge.value, signal)

            if (!credential) {
                return false
            }

            signInWithPasskeyUsingCredential(credential)
        },
        enabled: !!challenge,
        retry: false,
    })

    const signInWithPasskey = useCallback(async () => {
        if (!challenge) return

        const credential = await passkeyLogin(challenge.value)

        if (!credential) return

        signInWithPasskeyUsingCredential(credential)
    }, [challenge, signInWithPasskeyUsingCredential])

    const Comp: ComponentType<CommonButtonProps> = Slot.Root

    return (
        <Comp type="button" onClick={signInWithPasskey}>
            {children}
        </Comp>
    )
}
