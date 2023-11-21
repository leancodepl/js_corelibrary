import { ElementType } from "react";
import { UiNode } from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { hasPassword } from "../utils/helpers";

type RegistrationSectionProps = {
    nodes: UiNode[];
    RegistrationSectionWrapper: ElementType;
};

export function RegistrationSection({ nodes, RegistrationSectionWrapper }: RegistrationSectionProps) {
    if (!hasPassword(nodes)) return null;

    const filter = {
        nodes,
        groups: ["password"],
    };

    return (
        <RegistrationSectionWrapper>
            <FilterFlowNodes filter={{ ...filter, excludeAttributes: "submit" }} />
            <FilterFlowNodes filter={{ ...filter, attributes: "submit" }} />
        </RegistrationSectionWrapper>
    );
}
