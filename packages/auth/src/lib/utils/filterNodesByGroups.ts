/* eslint-disable @typescript-eslint/no-explicit-any */
import { UiNode, UiNodeGroupEnum, UiNodeInputAttributesTypeEnum } from "@ory/kratos-client"
import { getNodeInputType } from "./getNodeInputType"

type FilterNodesByGroups = {
    nodes: Array<UiNode>
    groups?: Array<UiNodeGroupEnum | string> | UiNodeGroupEnum | string
    withoutDefaultGroup?: boolean
    attributes?: Array<UiNodeInputAttributesTypeEnum | string> | UiNodeInputAttributesTypeEnum | string
    withoutDefaultAttributes?: boolean
    excludeAttributes?: Array<UiNodeInputAttributesTypeEnum | string> | UiNodeInputAttributesTypeEnum | string
}

/**
 * Filters nodes by their groups and attributes.
 * If no filtering options are specified, all nodes are returned.
 * Will always add default nodes unless `withoutDefaultGroup` is true.
 * Will always add default attributes unless `withoutDefaultAttributes` is true.
 * @param {Object} filterNodesByGroups - An object containing the nodes and the filtering options.
 * @param {Array<UiNode>} filterNodesByGroups.nodes - An array of nodes.
 * @param {Array<UiNodeGroupEnum | string> | string} filterNodesByGroups.groups - An array or comma seperated strings of groups to filter by.
 * @param {boolean} filterNodesByGroups.withoutDefaultGroup - If true, will not add default nodes under the 'default' category.
 * @param {Array<UiNodeInputAttributesTypeEnum | string> | string} filterNodesByGroups.attributes - An array or comma seperated strings of attributes to filter by.
 * @param {boolean} filterNodesByGroups.withoutDefaultAttributes - If true, will not add default attributes such as 'hidden' and 'script'.
 */
export const filterNodesByGroups = ({
    nodes,
    groups,
    withoutDefaultGroup,
    attributes,
    withoutDefaultAttributes,
    excludeAttributes,
}: FilterNodesByGroups) => {
    const search = (s: Array<string> | string) => (typeof s === "string" ? s.split(",") : s)

    return nodes.filter(({ group, attributes: attr }) => {
        // if we have not specified any group or attribute filters, return all nodes
        if (!groups && !attributes && !excludeAttributes) return true

        const g = search(groups as any) || []
        if (!withoutDefaultGroup) {
            g.push("default")
        }

        // filter the attributes
        const a = search(attributes as any) || []
        if (!withoutDefaultAttributes) {
            // always add hidden fields e.g. csrf
            if (group.includes("default")) {
                a.push("hidden")
            }
            // automatically add the necessary fields for webauthn and totp
            if (group.includes("webauthn") || group.includes("totp")) {
                a.push("input", "script")
            }
        }

        // filter the attributes to exclude
        const ea = search(excludeAttributes as any) || []

        const filterGroup = groups ? g.includes(group) : true
        const filterAttributes = attributes ? a.includes(getNodeInputType(attr)) : true
        const filterExcludeAttributes = excludeAttributes ? !ea.includes(getNodeInputType(attr)) : true

        return filterGroup && filterAttributes && filterExcludeAttributes
    })
}
