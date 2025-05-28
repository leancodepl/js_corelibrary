import { ComponentType, ReactNode, useCallback } from "react"
import { getCsrfToken, getNodesById, isPasskeyUiNode } from "../../../utils"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../hooks"
import { AddPasskey } from "./fields"

export type PasskeysFormProps = {
    AddPasskey?: ComponentType<{ children: ReactNode }>
    existingPasskeys: {
        addedAt: string
        addedAtUnix: number
        id: string
        name: string
        removePasskey: () => void
    }[]
    isRemoving: boolean
}

type PasskeysFormWrapperProps = {
    passkeysForm: ComponentType<PasskeysFormProps>
}

export function PasskeysFormWrapper({ passkeysForm: PasskeysForm }: PasskeysFormWrapperProps) {
    const { mutateAsync: updateSettingsFlow, isPending } = useUpdateSettingsFlow()
    const { data: settingsFlow } = useGetSettingsFlow()

    const handleRemovePasskey = useCallback(
        (passkeyId: string) => {
            if (isPending) {
                return
            }

            if (!settingsFlow) {
                throw new Error("Settings flow is not available")
            }

            updateSettingsFlow({
                method: "passkey",
                csrf_token: getCsrfToken(settingsFlow),
                passkey_remove: passkeyId,
            })
        },
        [isPending, settingsFlow, updateSettingsFlow],
    )

    if (!settingsFlow) {
        return null
    }

    const existingPasskeys = getNodesById(settingsFlow.ui.nodes, "passkey_remove")
        .filter(isPasskeyUiNode)
        .map(({ meta, attributes }) => ({
            addedAt: meta.label.context.added_at,
            addedAtUnix: meta.label.context.added_at_unix,
            id: attributes.value as string,
            name: meta.label.context.display_name,
            removePasskey: () => handleRemovePasskey(attributes.value),
        }))

    return <PasskeysForm AddPasskey={AddPasskey} existingPasskeys={existingPasskeys} isRemoving={isPending} />
}
