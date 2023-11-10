import { ElementType } from "react";
import { UiNode } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { hasPassword } from "../helpers/utils";

type RegistrationSectionProps = {
    nodes: UiNode[];
    RegistrationSectionWrapper: ElementType;
};

export function RegistrationSection({ nodes, RegistrationSectionWrapper }: RegistrationSectionProps) {
    if (!hasPassword(nodes)) return null;

    return (
        <RegistrationSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes: nodes,
                    groups: ["password"],
                    excludeAttributes: "submit",
                }}
            />
            <FilterFlowNodes
                filter={{
                    nodes: nodes,
                    groups: ["password"],
                    attributes: "submit",
                }}
            />
        </RegistrationSectionWrapper>
    );
}
