import { ElementType } from "react"
import { UiNode } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"

type IdentifierFirstLoginSectionProps = {
    nodes: UiNode[]
    IdentifierFirstLoginSectionWrapper: ElementType
}

export function IdentifierFirstLoginSection({
    nodes,
    IdentifierFirstLoginSectionWrapper,
}: IdentifierFirstLoginSectionProps) {
    return (
        <IdentifierFirstLoginSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: ["default", "identifier_first"],
                    excludeAttributes: ["submit", "hidden"],
                }}
            />
            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: ["identifier_first"],
                    attributes: "submit",
                }}
            />
        </IdentifierFirstLoginSectionWrapper>
    )
}
