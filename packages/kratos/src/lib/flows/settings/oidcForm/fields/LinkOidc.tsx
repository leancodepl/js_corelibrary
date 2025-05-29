import { ComponentType, ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonButtonProps } from "../../../../utils"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../../hooks"

type OidcProps = {
    children: ReactNode
    provider: string
}

export function Oidc({ children, provider }: OidcProps) {
    const { mutate: updateSettingsFlow } = useUpdateSettingsFlow()
    const { data: settingsFlow } = useGetSettingsFlow()

    const linkProvider = useCallback(() => {
        if (!settingsFlow) return

        updateSettingsFlow({
            method: "oidc",
            link: provider,
        })
    }, [settingsFlow, updateSettingsFlow, provider])

    const Comp: ComponentType<CommonButtonProps> = Slot.Root

    return (
        <Comp type="button" onClick={linkProvider}>
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
