import { ElementType } from "react";
import { SettingsFlow } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { hasPassword } from "../utils/helpers";

type PasswordSettingsProps = {
    flow: SettingsFlow;
    PasswordSettingsSectionWrapper: ElementType;
};

export function PasswordSettingsSection({ flow, PasswordSettingsSectionWrapper }: PasswordSettingsProps) {
    if (!hasPassword(flow.ui.nodes)) return null;

    const filter = {
        nodes: flow.ui.nodes,
        groups: "password",
        withoutDefaultGroup: true,
    };

    return (
        <PasswordSettingsSectionWrapper>
            <FilterFlowNodes filter={{ ...filter, excludeAttributes: "submit,button" }} />
            <FilterFlowNodes filter={{ ...filter, attributes: "submit,button" }} />
        </PasswordSettingsSectionWrapper>
    );
}
