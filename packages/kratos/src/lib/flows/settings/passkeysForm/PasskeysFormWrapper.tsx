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
    isLoading: boolean
    isPending: boolean
}

type PasskeysFormWrapperProps = {
    passkeysForm: ComponentType<PasskeysFormProps>
}

export function PasskeysFormWrapper({ passkeysForm: PasskeysForm }: PasskeysFormWrapperProps) {
    const { data: settingsFlow } = useGetSettingsFlow()
    const { removePasskey, isPending, addNewPasskey } = usePasskeys()

    const existingPasskeys = settingsFlow
        ? getNodesById(settingsFlow.ui.nodes, "passkey_remove")
              .filter(isPasskeyRemoveUiNode)
              .map(({ meta, attributes }) => ({
                  addedAt: meta.label.context.added_at,
                  addedAtUnix: meta.label.context.added_at_unix,
                  id: String(attributes.value),
                  name: meta.label.context.display_name,
                  removePasskey: () => removePasskey(attributes.value),
              }))
        : []

    return (
        <PasskeysForm
            addNewPasskey={addNewPasskey}
            existingPasskeys={existingPasskeys}
            isLoading={!settingsFlow}
            isPending={isPending}
        />
    )
}
