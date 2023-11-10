import { ElementType } from "react";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { SelfServiceFlow } from "../helpers/userAuthForm";
import { hasWebauthn } from "../helpers/utils";

type PasswordlessSectionProps = {
    flow: SelfServiceFlow;
    PasswordlessSectionWrapper: ElementType;
};

export function PasswordlessSection({ flow, PasswordlessSectionWrapper }: PasswordlessSectionProps) {
    if (!hasWebauthn(flow.ui.nodes)) return null;

    return (
        <PasswordlessSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes: flow.ui.nodes,
                    // we will also map default fields here but not oidc and password fields
                    groups: ["webauthn"],
                    withoutDefaultAttributes: true,
                    excludeAttributes: ["hidden", "button", "submit"], // the form will take care of hidden fields
                }}
            />

            <FilterFlowNodes
                filter={{
                    nodes: flow.ui.nodes,
                    groups: ["webauthn"],
                    withoutDefaultAttributes: true,
                    attributes: ["button", "submit"],
                }}
            />
        </PasswordlessSectionWrapper>
    );
}
