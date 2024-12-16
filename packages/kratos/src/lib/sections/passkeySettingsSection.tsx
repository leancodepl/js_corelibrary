import { ElementType } from "react"
import { SettingsFlow, UiNodeGroupEnum } from "../kratos"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"
import { hasPasskey } from "../utils/helpers"

type WebAuthnSettingsProps = {
    flow: SettingsFlow
    PasskeySettingsSectionWrapper: ElementType
}

export function PasskeySettingsSection({ flow, PasskeySettingsSectionWrapper }: WebAuthnSettingsProps) {
    if (!hasPasskey(flow.ui.nodes)) return null

    const filter = {
        nodes: flow.ui.nodes,
        groups: UiNodeGroupEnum.Passkey,
        withoutDefaultGroup: true,
    }

    return (
        <PasskeySettingsSectionWrapper>
            <FilterFlowNodes filter={{ ...filter, excludeAttributes: "submit,button" }} />
            <FilterFlowNodes filter={{ ...filter, attributes: "submit,button" }} />
        </PasskeySettingsSectionWrapper>
    )
}
