import { ComponentType, ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonButtonProps } from "../../../../utils"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../../hooks"

export type OidcButtonProps = CommonButtonProps & {
    oidcType?: "link" | "unlink"
}

type OidcProps = {
    children: ReactNode
    provider: string
    type: "link" | "unlink"
}

export function Oidc({ children, provider, type }: OidcProps) {
    const { mutate: updateSettingsFlow } = useUpdateSettingsFlow()
    const { data: settingsFlow } = useGetSettingsFlow()

    const linkProvider = useCallback(() => {
        if (!settingsFlow) return

        updateSettingsFlow({
            method: "oidc",
            [type]: provider,
        })
    }, [settingsFlow, updateSettingsFlow, type, provider])

    const Comp: ComponentType<OidcButtonProps> = Slot.Root

    return (
        <Comp oidcType={type} type="button" onClick={linkProvider}>
            {children}
        </Comp>
    )
}
