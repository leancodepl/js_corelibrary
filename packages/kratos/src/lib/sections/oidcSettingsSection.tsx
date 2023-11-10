import { ElementType } from "react";
import { SettingsFlow } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { hasOidc } from "../helpers/utils";

type OidcSettingsProps = {
    flow: SettingsFlow;
    OidcSettingsSectionWrapper: ElementType;
};

export function OidcSettingsSection({ flow, OidcSettingsSectionWrapper }: OidcSettingsProps) {
    if (!hasOidc(flow.ui.nodes)) return null;

    const filter = {
        nodes: flow.ui.nodes,
        groups: "oidc",
        withoutDefaultGroup: true,
    };

    return (
        <OidcSettingsSectionWrapper>
            <FilterFlowNodes filter={filter} />
        </OidcSettingsSectionWrapper>
    );
}
