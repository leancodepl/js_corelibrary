import { ElementType } from "react"
import { UiNodeGroupEnum } from "../kratos"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"
import { SelfServiceFlow } from "../helpers/userAuthForm"
import { filterNodesByGroups } from "../utils/filterNodesByGroups"
import { hasOidc } from "../utils/helpers"

type OidcSectionProps = {
    flow: SelfServiceFlow
    OidcSectionWrapper: ElementType
}

export function OidcSection({ flow, OidcSectionWrapper }: OidcSectionProps) {
    if (!hasOidc(flow.ui.nodes)) return null

    const hasOidcTraits =
        filterNodesByGroups({
            nodes: flow.ui.nodes,
            groups: UiNodeGroupEnum.Oidc,
            withoutDefaultGroup: true,
            excludeAttributes: "submit",
        }).length > 0

    return (
        <OidcSectionWrapper>
            {hasOidcTraits && (
                <FilterFlowNodes
                    filter={{
                        nodes: flow.ui.nodes,
                        groups: UiNodeGroupEnum.Oidc,
                        withoutDefaultGroup: true,
                        excludeAttributes: "submit",
                    }}
                />
            )}

            <FilterFlowNodes
                filter={{
                    nodes: flow.ui.nodes,
                    groups: UiNodeGroupEnum.Oidc,
                    attributes: "submit",
                }}
            />
        </OidcSectionWrapper>
    )
}
