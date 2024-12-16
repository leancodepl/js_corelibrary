import { ElementType } from "react"
import { UiNode, UiNodeGroupEnum } from "../kratos"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"

type ProfileRegistrationSectionProps = {
    nodes: UiNode[]
    ProfileRegistrationSectionWrapper: ElementType
}

export function ProfileRegistrationSection({
    nodes,
    ProfileRegistrationSectionWrapper,
}: ProfileRegistrationSectionProps) {
    return (
        <ProfileRegistrationSectionWrapper>
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
        </ProfileRegistrationSectionWrapper>
    )
}
