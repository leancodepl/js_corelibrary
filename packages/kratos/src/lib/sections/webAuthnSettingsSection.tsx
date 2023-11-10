import { ElementType } from "react";
import { SettingsFlow } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { hasWebauthn } from "../helpers/utils";

type WebAuthnSettingsProps = {
    flow: SettingsFlow;
    WebAuthnSettingsSectionWrapper: ElementType;
};

export function WebAuthnSettingsSection({ flow, WebAuthnSettingsSectionWrapper }: WebAuthnSettingsProps) {
    if (!hasWebauthn(flow.ui.nodes)) return null;

    const filter = {
        nodes: flow.ui.nodes,
        groups: "webauthn",
        withoutDefaultGroup: true,
    };

    return (
        <WebAuthnSettingsSectionWrapper>
            <FilterFlowNodes filter={{ ...filter, excludeAttributes: "submit,button" }} />
            <FilterFlowNodes filter={{ ...filter, attributes: "submit,button" }} />
        </WebAuthnSettingsSectionWrapper>
    );
}
