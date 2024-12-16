import { ElementType } from "react"
import { UiNodeGroupEnum } from "../kratos"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"
import { SelfServiceFlow } from "../helpers/userAuthForm"
import { hasPasskey } from "../utils/helpers"

type PasswordlessSectionProps = {
    flow: SelfServiceFlow
    PasswordlessSectionWrapper: ElementType
}

export function PasswordlessSection({ flow, PasswordlessSectionWrapper }: PasswordlessSectionProps) {
    if (!hasPasskey(flow.ui.nodes)) return null

    const filter = {
        nodes: flow.ui.nodes,
        groups: UiNodeGroupEnum.Passkey,
        withoutDefaultAttributes: true,
    }

    return (
        <PasswordlessSectionWrapper>
            <FilterFlowNodes
                filter={{
                    ...filter,
                    groups: ["identifier_first", "passkey"],
                    attributes: ["hidden"],
                }}
            />
            <FilterFlowNodes
                filter={{
                    ...filter,
                    excludeAttributes: ["hidden", "button", "submit"],
                }}
            />
            <FilterFlowNodes
                filter={{
                    ...filter,
                    attributes: ["button", "submit"],
                    excludeAttributes: ["hidden"],
                }}
            />
        </PasswordlessSectionWrapper>
    )
}
