import { ElementType } from "react"
import { UiNode, UiNodeGroupEnum } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"
import { hasPassword } from "../utils/helpers"

type RegistrationSectionProps = {
    nodes: UiNode[]
    RegistrationSectionWrapper: ElementType
}

export function RegistrationSection({ nodes, RegistrationSectionWrapper }: RegistrationSectionProps) {
    if (!hasPassword(nodes)) return null

    const filter = {
        nodes,
        groups: UiNodeGroupEnum.Password,
    }

    return (
        <RegistrationSectionWrapper>
            <FilterFlowNodes
                filter={{
                    ...filter,
                    excludeAttributes: "submit,hidden",
                }}
            />
            <FilterFlowNodes
                filter={{
                    ...filter,
                    excludeAttributes: "hidden",
                    attributes: "submit",
                }}
            />
        </RegistrationSectionWrapper>
    )
}
