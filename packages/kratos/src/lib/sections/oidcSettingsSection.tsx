import { ElementType } from "react"
import { SettingsFlow, UiNodeGroupEnum } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"
import { hasOidc } from "../utils/helpers"

type OidcSettingsProps = {
    flow: SettingsFlow
    OidcSettingsSectionWrapper: ElementType
}

export function OidcSettingsSection({ flow, OidcSettingsSectionWrapper }: OidcSettingsProps) {
    if (!hasOidc(flow.ui.nodes)) return null

    return (
        <OidcSettingsSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes: flow.ui.nodes,
                    groups: UiNodeGroupEnum.Oidc,
                    withoutDefaultGroup: true,
                }}
            />
        </OidcSettingsSectionWrapper>
    )
}
