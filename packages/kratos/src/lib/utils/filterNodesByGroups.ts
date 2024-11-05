import { UiNode, UiNodeGroupEnum, UiNodeInputAttributesTypeEnum } from "@ory/client"
import { getNodeInputType } from "./getNodeInputType"

export type FilterNodesByGroups = {
    nodes: Array<UiNode>
    groups?: Array<string | UiNodeGroupEnum> | string | UiNodeGroupEnum
    withoutDefaultGroup?: boolean
    attributes?: Array<string | UiNodeInputAttributesTypeEnum> | string | UiNodeInputAttributesTypeEnum
    withoutDefaultAttributes?: boolean
    excludeAttributes?: Array<string | UiNodeInputAttributesTypeEnum> | string | UiNodeInputAttributesTypeEnum
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
}: FilterNodesByGroups) =>
    nodes.filter(({ group, attributes: attr }) => {
        // if we have not specified any group or attribute filters, return all nodes
        if (!groups && !attributes && !excludeAttributes) return true

        const g = search(groups)
        if (!withoutDefaultGroup) {
            g.push(UiNodeGroupEnum.Default)
        }

        // filter the attributes
        const a = search(attributes)
        if (!withoutDefaultAttributes) {
            // always add hidden fields e.g. csrf
            if (group.includes(UiNodeGroupEnum.Default)) {
                a.push("hidden")
            }
            // automatically add the necessary fields for webauthn and totp
            if (group.includes(UiNodeGroupEnum.Webauthn) || group.includes(UiNodeGroupEnum.Totp)) {
                a.push("input", "script")
            }
        }

        // filter the attributes to exclude
        const ea = search(excludeAttributes)

        const filterGroup = groups ? g.includes(group) : true
        const filterAttributes = attributes ? a.includes(getNodeInputType(attr)) : true
        const filterExcludeAttributes = excludeAttributes ? !ea.includes(getNodeInputType(attr)) : true

        return filterGroup && filterAttributes && filterExcludeAttributes
    })

function search(s?: string | string[]) {
    if (s !== undefined && typeof s === "string") return s.split(",")

    return s ?? []
}
