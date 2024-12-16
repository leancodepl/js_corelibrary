import { ElementType } from "react"
import { SettingsFlow, UiNodeGroupEnum } from "../kratos"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"

type ProfileSettingsProps = {
    flow: SettingsFlow
    ProfileSettingsSectionWrapper: ElementType
}

export function ProfileSettingsSection({ flow, ProfileSettingsSectionWrapper }: ProfileSettingsProps) {
    const filter = { nodes: flow.ui.nodes, groups: UiNodeGroupEnum.Profile }

    return (
        <ProfileSettingsSectionWrapper>
            <FilterFlowNodes filter={{ ...filter, excludeAttributes: "submit,button" }} />
            <FilterFlowNodes filter={{ ...filter, attributes: "submit,button" }} />
        </ProfileSettingsSectionWrapper>
    )
}
