import { ComponentType, ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonButtonProps } from "../../../../utils"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../../hooks"

type OidcProps = {
    children: ReactNode
    provider: string
}

export function UnlinkOidc({ children, provider }: OidcProps) {
    const { mutate: updateSettingsFlow } = useUpdateSettingsFlow()
    const { data: settingsFlow } = useGetSettingsFlow()

    const unlinkProvider = useCallback(() => {
        if (!settingsFlow) return

        updateSettingsFlow({
            method: "oidc",
            unlink: provider,
        })
    }, [settingsFlow, updateSettingsFlow, provider])

    const Comp: ComponentType<CommonButtonProps> = Slot.Root

    return (
        <Comp type="button" onClick={unlinkProvider}>
            {children}
        </Comp>
    )
}

type SpecificOidcProps = {
    children: ReactNode
}

export function UnlinkApple({ children }: SpecificOidcProps) {
    return <UnlinkOidc provider="apple">{children}</UnlinkOidc>
}

export function UnlinkFacebook({ children }: SpecificOidcProps) {
    return <UnlinkOidc provider="facebook">{children}</UnlinkOidc>
}

export function UnlinkGoogle({ children }: SpecificOidcProps) {
    return <UnlinkOidc provider="google">{children}</UnlinkOidc>
}
