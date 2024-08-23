import { ElementType } from "react"
import { UiNode, UiNodeGroupEnum } from "@ory/client"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"
import { hasPassword } from "../utils/helpers"

type LoginSectionProps = {
    nodes: UiNode[]
    LoginSectionWrapper: ElementType
}

export function LoginSection({ nodes, LoginSectionWrapper }: LoginSectionProps) {
    if (!hasPassword(nodes)) return null

    return (
        <LoginSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: [UiNodeGroupEnum.Default, UiNodeGroupEnum.Password],
                    excludeAttributes: ["submit", "hidden"],
                }}
            />

            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: UiNodeGroupEnum.Password,
                    attributes: "submit",
                }}
            />
        </LoginSectionWrapper>
    )
}
