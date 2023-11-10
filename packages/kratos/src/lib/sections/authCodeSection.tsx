import { ElementType } from "react";
import { UiNode } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { hasCode } from "../helpers/utils";

type AuthCodeSectionProps = {
    nodes: UiNode[];
    AuthCodeSectionWrapper: ElementType;
};

/**
 * AuthCodeSection renders the fields for login and registration via one-time code.
 * Please see the Ory docs for more information: https://www.ory.sh/docs/kratos/passwordless/one-time-code
 * @param nodes - Ory UiNode[]
 * @see AuthCodeSectionProps
 */
export function AuthCodeSection({ nodes, AuthCodeSectionWrapper }: AuthCodeSectionProps) {
    if (!hasCode(nodes)) return null;

    return (
        <AuthCodeSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes: nodes,
                    groups: ["code"],
                    // we don't want to map the default group twice
                    // the form already maps hidden fields under the default group
                    // we are only interested in hidden fields that are under the code group
                    withoutDefaultGroup: true,
                    withoutDefaultAttributes: true,
                    attributes: ["hidden"],
                }}
            />
            <FilterFlowNodes
                filter={{
                    nodes: nodes,
                    groups: "code",
                    withoutDefaultAttributes: true,
                    excludeAttributes: ["hidden", "button", "submit"], // the form will take care of default (csrf) hidden fields
                }}
            />
            {/* include hidden here because we want to have resend support */}
            {/* exclude default group because we dont want to map csrf twice */}
            <FilterFlowNodes
                filter={{
                    nodes: nodes,
                    groups: "code",
                    withoutDefaultAttributes: true,
                    attributes: ["button", "submit"],
                }}
            />
        </AuthCodeSectionWrapper>
    );
}
