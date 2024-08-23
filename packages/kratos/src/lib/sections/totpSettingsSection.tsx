import { ElementType } from "react"
import { SettingsFlow, UiNodeGroupEnum } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"
import { hasTotp } from "../utils/helpers"

type TotpSettingsProps = {
    flow: SettingsFlow
    TotpSettingsSectionWrapper: ElementType
}

export function TotpSettingsSection({ flow, TotpSettingsSectionWrapper }: TotpSettingsProps) {
    if (!hasTotp(flow.ui.nodes)) return null

    const filter = {
        nodes: flow.ui.nodes,
        groups: UiNodeGroupEnum.Totp,
        withoutDefaultGroup: true,
    }

    return (
        <TotpSettingsSectionWrapper>
            <FilterFlowNodes filter={{ ...filter, excludeAttributes: "submit,button" }} />
            <FilterFlowNodes filter={{ ...filter, attributes: "submit,button" }} />
        </TotpSettingsSectionWrapper>
    )
}
