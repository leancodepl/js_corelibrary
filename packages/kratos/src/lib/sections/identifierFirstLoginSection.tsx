import { ElementType } from "react"
import { UiNode, UiNodeGroupEnum } from "@ory/client"
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
                    groups: [UiNodeGroupEnum.Default, UiNodeGroupEnum.IdentifierFirst],
                    excludeAttributes: ["submit", "hidden"],
                }}
            />
            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: UiNodeGroupEnum.IdentifierFirst,
                    attributes: "submit",
                }}
            />
        </IdentifierFirstLoginSectionWrapper>
    )
}
