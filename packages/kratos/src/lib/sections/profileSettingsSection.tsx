import { ElementType } from "react";
import { SettingsFlow } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";

type ProfileSettingsProps = {
    flow: SettingsFlow;
    ProfileSettingsSectionWrapper: ElementType;
};

export function ProfileSettingsSection({ flow, ProfileSettingsSectionWrapper }: ProfileSettingsProps) {
    const filter = { nodes: flow.ui.nodes, groups: "profile" };

    return (
        <ProfileSettingsSectionWrapper>
            <FilterFlowNodes filter={{ ...filter, excludeAttributes: "submit,button" }} />
            <FilterFlowNodes filter={{ ...filter, attributes: "submit,button" }} />
        </ProfileSettingsSectionWrapper>
    );
}
