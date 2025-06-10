import { ComponentType } from "react"
import { getNodesById, isPasskeyRemoveUiNode } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
import { usePasskeys } from "./hooks"

export type PasskeysFormProps = {
    addNewPasskey?: () => void
    existingPasskeys: {
        addedAt: string
        addedAtUnix: number
        id: string
        name: string
        removePasskey: () => void
    }[]
    isPending: boolean
}

type PasskeysFormWrapperProps = {
    passkeysForm: ComponentType<PasskeysFormProps>
}

export function PasskeysFormWrapper({ passkeysForm: PasskeysForm }: PasskeysFormWrapperProps) {
    const { data: settingsFlow } = useGetSettingsFlow()
    const { removePasskey, isPending, addNewPasskey } = usePasskeys()

    if (!settingsFlow) {
        return null
    }

    const existingPasskeys = getNodesById(settingsFlow.ui.nodes, "passkey_remove")
        .filter(isPasskeyRemoveUiNode)
        .map(({ meta, attributes }) => ({
            addedAt: meta.label.context.added_at,
            addedAtUnix: meta.label.context.added_at_unix,
            id: String(attributes.value),
            name: meta.label.context.display_name,
            removePasskey: () => removePasskey(attributes.value),
        }))

    return <PasskeysForm addNewPasskey={addNewPasskey} existingPasskeys={existingPasskeys} isPending={isPending} />
}
