import { ElementType } from "react";
import { SettingsFlow } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { hasLookupSecret } from "../helpers/utils";

type LookupSecretSettingsProps = {
    flow: SettingsFlow;
    LookupSecretSettingsSectionWrapper: ElementType;
};

export function LookupSecretSettingsSection({ flow, LookupSecretSettingsSectionWrapper }: LookupSecretSettingsProps) {
    const filter = {
        nodes: flow.ui.nodes,
        groups: "lookup_secret",
        withoutDefaultGroup: true,
    };
    if (!hasLookupSecret(flow.ui.nodes)) return null;

    return (
        <LookupSecretSettingsSectionWrapper>
            <FilterFlowNodes filter={{ ...filter, excludeAttributes: "submit,button" }} />
            <FilterFlowNodes filter={{ ...filter, attributes: "submit,button" }} />
        </LookupSecretSettingsSectionWrapper>
    );
}
