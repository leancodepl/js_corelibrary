import { ElementType } from "react"
import { UiNodeGroupEnum } from "@ory/client"
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
        groups: [UiNodeGroupEnum.Passkey],
        withoutDefaultAttributes: true,
    }

    return (
        <PasswordlessSectionWrapper>
            <FilterFlowNodes
                filter={{
                    ...filter,
                    // we will also map default fields here but not oidc and password fields
                    excludeAttributes: ["hidden", "button", "submit"], // the form will take care of hidden fields
                }}
            />

            <FilterFlowNodes filter={{ ...filter, attributes: ["button", "submit"] }} />
        </PasswordlessSectionWrapper>
    )
}
