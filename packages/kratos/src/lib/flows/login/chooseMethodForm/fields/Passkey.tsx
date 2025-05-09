import { ComponentType, ReactNode, useCallback, useMemo } from "react"
import * as Slot from "@radix-ui/react-slot"
import { useQuery } from "@tanstack/react-query"
import { CommonButtonProps, getCsrfToken, getNodeById, inputNodeAttributes } from "../../../../utils"
import { passkeyLogin, passkeyLoginInit } from "../../../../utils/passkeys"
import { useGetLoginFlow, useUpdateLoginFlow } from "../../hooks"

type PasskeyProps = {
    children: ReactNode
}

export function Passkey({ children }: PasskeyProps) {
    const { mutate: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    const signInWithPasskeyUsingCredential = useCallback(
        (credential: string) => {
            if (!loginFlow) return

            updateLoginFlow({
                method: "passkey",
                csrf_token: getCsrfToken(loginFlow),
                passkey_login: credential,
            })
        },
        [loginFlow, updateLoginFlow],
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
