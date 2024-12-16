import { ElementType } from "react"
import { UiNode, UiNodeGroupEnum } from "../kratos"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"

type LinkSectionProps = {
    nodes: UiNode[]
    LinkSectionWrapper: ElementType
}

/**
 * LinkSection renders the fields for recovery and verification
 * Please see the Ory docs for more information:
 * - https://www.ory.sh/docs/kratos/self-service/flows/account-recovery-password-reset
 * - https://www.ory.sh/docs/kratos/self-service/flows/verify-email-account-activation
 */
export function LinkSection({ nodes, LinkSectionWrapper }: LinkSectionProps) {
    return (
        <LinkSectionWrapper>
            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: [UiNodeGroupEnum.Link, UiNodeGroupEnum.Code],
                    excludeAttributes: "submit",
                }}
            />

            <FilterFlowNodes
                filter={{
                    nodes,
                    groups: [UiNodeGroupEnum.Link, UiNodeGroupEnum.Code],
                    attributes: "submit",
                }}
            />
        </LinkSectionWrapper>
    )
}
