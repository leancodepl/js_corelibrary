import {
    isUiNodeAnchorAttributes,
    isUiNodeImageAttributes,
    isUiNodeInputAttributes,
    isUiNodeScriptAttributes,
    isUiNodeTextAttributes,
    UiNode,
} from "../kratos"
import { FilterNodesByGroups, filterNodesByGroups } from "../utils/filterNodesByGroups"
import { getNodeInputType } from "../utils/getNodeInputType"
import { Node } from "./node"

type FilterFlowNodesProps = {
    filter: FilterNodesByGroups
    includeCSRF?: boolean
}

export function FilterFlowNodes({ filter, includeCSRF, ...overrides }: FilterFlowNodesProps) {
    const getInputName = (node: UiNode): string =>
        isUiNodeInputAttributes(node.attributes) ? node.attributes.name : ""

    const nodes = filterNodesByGroups(filter)
        // we don't want to map the csrf token every time, only on the form level
        .filter(node => includeCSRF || !(getInputName(node) === "csrf_token"))
        .map((node, k) => ({
            node: (
                <Node
                    key={
                        isUiNodeInputAttributes(node.attributes)
                            ? (node.attributes.type === "button" || node.attributes.type === "submit") &&
                              node.attributes.value
                                ? `${node.attributes.name}_${node.attributes.value}`
                                : node.attributes.name
                            : isUiNodeImageAttributes(node.attributes)
                              ? node.attributes.src
                              : isUiNodeAnchorAttributes(node.attributes) ||
                                  isUiNodeTextAttributes(node.attributes) ||
                                  isUiNodeScriptAttributes(node.attributes)
                                ? node.attributes.id
                                : k
                    }
                    node={node}
                    {...overrides}
                />
            ),
            hidden: getNodeInputType(node.attributes) === "hidden",
        }))

    if (nodes.length === 0) return null

    return <>{nodes.map(node => node.node)}</>
}
