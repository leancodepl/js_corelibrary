import {
  getNodeId,
  handleFlowError,
  isUiNodeInputAttributes,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeScriptAttributesNodeTypeEnum,
  UiNodeTypeEnum,
} from "../kratos"
import { GetFlowError } from "../types"

export function getNodeById(nodes: UiNode[] | undefined, name: string) {
  return nodes?.find(node => getNodeId(node) === name)
}

export function getNodesById(nodes: UiNode[] | undefined, name: string) {
  return nodes?.filter(node => getNodeId(node) === name) ?? []
}

export function inputNodeAttributes(node?: UiNode) {
  if (!node) return

  if (isUiNodeInputAttributes(node.attributes)) return node.attributes

  return
}

export function inputNodeMessages(node?: UiNode) {
  if (!node) return

  if (isUiNodeInputAttributes(node.attributes)) return node.messages

  return
}

export function getCsrfToken(flow: { ui: { nodes: UiNode[] } }) {
  const attributes = inputNodeAttributes(getNodeById(flow.ui.nodes, "csrf_token"))

  if (!attributes || typeof attributes.value !== "string") throw new Error("CSRF token not found")

  return attributes.value
}

export const getNodesOfGroup = <TGroup extends UiNodeGroupEnum>(nodes: UiNode[], group: TGroup) =>
  nodes.filter(node => node.group === group) as (UiNode & { group: TGroup })[]

export const isPasskeyRemoveUiNode = (
  node: UiNode,
): node is UiNode & {
  group: typeof UiNodeGroupEnum.Passkey
  type: typeof UiNodeTypeEnum.Input
  attributes: {
    node_type: typeof UiNodeScriptAttributesNodeTypeEnum.Input
    name: "passkey_remove"
  }
  meta: {
    label: {
      context: {
        added_at: string
        display_name: string
        added_at_unix: number
      }
    }
  }
} => {
  if (
    node.group !== UiNodeGroupEnum.Passkey ||
    node.type !== UiNodeTypeEnum.Input ||
    node.attributes.node_type !== UiNodeScriptAttributesNodeTypeEnum.Input ||
    node.attributes.name !== "passkey_remove" ||
    !node.meta?.label?.context
  ) {
    return false
  }

  const { context } = node.meta.label

  return (
    "added_at" in context &&
    typeof context.added_at === "string" &&
    "display_name" in context &&
    typeof context.display_name === "string" &&
    "added_at_unix" in context &&
    typeof context.added_at_unix === "number"
  )
}

export const defaultProviders = ["apple", "facebook", "google"] as const

export type DefaultOidcProvider = (typeof defaultProviders)[number]

export type OidcProvider = DefaultOidcProvider | string

export type OidcProviderUiNode<TProviderId extends string = string> = Omit<UiNode, "attributes" | "group"> & {
  group: "oidc"
  attributes: Omit<UiNodeInputAttributes, "node_type" | "value"> & {
    node_type: "input"
    value: TProviderId
  }
}

export const isOidcProviderUiNode = (node: UiNode): node is OidcProviderUiNode =>
  node.group === "oidc" && node.attributes.node_type === "input" && typeof node.attributes.value === "string"

export const getOidcProviderUiNode = (nodes: UiNode[] | undefined, provider: string) =>
  nodes?.find((node): node is OidcProviderUiNode => isOidcProviderUiNode(node) && node.attributes.value === provider) ??
  undefined

export const getAllOidcProviderUiNodes = (nodes: UiNode[] | undefined): OidcProviderUiNode[] =>
  nodes?.filter((node): node is OidcProviderUiNode => isOidcProviderUiNode(node)) ?? []

export const handleFlowErrorResponse = async <TFlow>({ error }: { error: unknown }): Promise<TFlow | undefined> =>
  (await handleFlowError<TFlow>({
    onRedirect: (url, _external) => {
      globalThis.location.href = url
    },
    onRestartFlow: () => {
      throw new Error("Needs to restart the flow", {
        cause: GetFlowError.FlowRestartRequired,
      })
    },
    onValidationError: body => body,
  })(error)) as TFlow | undefined
