import { ElementType } from "react";
import { UiNode } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { hasPassword } from "../helpers/utils";

type LoginSectionProps = {
    nodes: UiNode[];
    LoginSectionWrapper: ElementType;
};

export function LoginSection({ nodes, LoginSectionWrapper }: LoginSectionProps) {
    if (!hasPassword(nodes)) return null;

    return (
        <LoginSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes: nodes,
                    groups: ["default", "password"],
                    excludeAttributes: ["submit", "hidden"],
                }}
            />

            <FilterFlowNodes
                filter={{
                    nodes: nodes,
                    groups: ["password"],
                    attributes: "submit",
                }}
            />
        </LoginSectionWrapper>
    );
}
