import { ComponentType, ReactNode, useCallback, useEffect, useMemo } from "react"
import * as Slot from "@radix-ui/react-slot"
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

    useEffect(() => {
        if (!challenge) return

        const abortController = new AbortController()
        ;(async () => {
            const credential = await passkeyLoginInit(challenge.value, abortController)

            if (!credential) return

            signInWithPasskeyUsingCredential(credential)
        })()

        return () => abortController.abort()
    }, [challenge, signInWithPasskeyUsingCredential])

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
