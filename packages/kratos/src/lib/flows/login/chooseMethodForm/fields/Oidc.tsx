import { ComponentType, ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonButtonProps, getCsrfToken } from "../../../../utils"
import { useGetLoginFlow, useUpdateLoginFlow } from "../../hooks"

type OidcProps = {
    children: ReactNode
    provider: string
}

export function Oidc({ children, provider }: OidcProps) {
    const { mutate: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    const signIn = useCallback(() => {
        if (!loginFlow) return

        updateLoginFlow({
            method: "oidc",
            csrf_token: getCsrfToken(loginFlow),
            provider,
        })
    }, [loginFlow, updateLoginFlow, provider])

    const Comp = Slot.Root as ComponentType<CommonButtonProps>

    return (
        <Comp type="button" onClick={signIn}>
            {children}
        </Comp>
    )
}

type SpecificOidcProps = {
    children: ReactNode
}

export function Apple({ children }: SpecificOidcProps) {
    return <Oidc provider="apple">{children}</Oidc>
}

export function Facebook({ children }: SpecificOidcProps) {
    return <Oidc provider="facebook">{children}</Oidc>
}

export function Google({ children }: SpecificOidcProps) {
    return <Oidc provider="google">{children}</Oidc>
}
