import { ElementType } from "react"
import { UiNode } from "@ory/client"
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
        </ProfileRegistrationSectionWrapper>
    )
}
