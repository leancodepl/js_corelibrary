import { ElementType } from "react";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { SelfServiceFlow } from "../helpers/userAuthForm";
import { hasWebauthn } from "../utils/helpers";

type PasswordlessSectionProps = {
    flow: SelfServiceFlow;
    PasswordlessSectionWrapper: ElementType;
};

export function PasswordlessSection({ flow, PasswordlessSectionWrapper }: PasswordlessSectionProps) {
    if (!hasWebauthn(flow.ui.nodes)) return null;

    const filter = {
        nodes: flow.ui.nodes,
        groups: ["webauthn"],
        withoutDefaultAttributes: true,
    };

    return (
        <PasswordlessSectionWrapper>
            <FilterFlowNodes
                filter={{
                    ...filter,
                    // we will also map default fields here but not oidc and password fields
                    excludeAttributes: ["hidden", "button", "submit"], // the form will take care of hidden fields
                }}
            />

            <FilterFlowNodes filter={{ ...filter, attributes: ["button", "submit"] }} />
        </PasswordlessSectionWrapper>
    );
}
