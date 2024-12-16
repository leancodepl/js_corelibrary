import { ElementType } from "react"
import { UiNode, UiNodeGroupEnum } from "../kratos"
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
                    groups: UiNodeGroupEnum.Profile,
                    excludeAttributes: "submit,hidden",
                }}
            />
            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: UiNodeGroupEnum.Profile,
                    excludeAttributes: "hidden",
                    attributes: "submit",
                }}
            />
        </ProfileLoginSectionWrapper>
    )
}
