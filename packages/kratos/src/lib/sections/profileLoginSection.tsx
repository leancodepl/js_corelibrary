import { ElementType } from "react"
import { UiNode } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"

type ProfileLoginSectionProps = {
    nodes: UiNode[]
    ProfileLoginSectionWrapper: ElementType
}

export function ProfileLoginSection({ nodes, ProfileLoginSectionWrapper }: ProfileLoginSectionProps) {
    return (
        <ProfileLoginSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: ["profile"],
                    excludeAttributes: "submit,hidden",
                }}
            />
            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: ["profile"],
                    excludeAttributes: "hidden",
                    attributes: "submit",
                }}
            />
        </ProfileLoginSectionWrapper>
    )
}
