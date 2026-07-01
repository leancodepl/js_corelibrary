import chalk from "chalk"
import { findCommonPathsPrefix } from "./findCommonPathsPrefix.js"

const { bold, cyan, yellow, dim } = chalk

type Severity = "error" | "info"

export type Message = (CrossFeatureMessage | NotSharedLevelMessage) & { severity: Severity }

export interface CrossFeatureMessage {
  rule: "cross-feature-nested-imports"
  /** The module performing the offending import. */
  importer: string
  /** The module it reaches into across a feature boundary. */
  imported: string
}

export interface NotSharedLevelMessage {
  rule: "not-shared-level"
  /** The shared component's current path. */
  component: string
  /** The modules that import the component. */
  dependents: string[]
  /** How to resolve the violation — move the file, or route imports through the folder's barrel. */
  remedy: NotSharedLevelRemedy
}

/**
 * A component imported only from outside its folder is parked in the wrong
 * place and should be moved to where its importers converge. A component that
 * also has an in-folder importer (a sibling or its barrel) is a cohesive member
 * of its folder; the violation is that some importers reach past the barrel, so
 * the fix is to re-export it from the barrel and import it through the barrel.
 */
export type NotSharedLevelRemedy =
  | { kind: "move"; suggestedLocation: string }
  | { kind: "use-barrel"; barrel: string | null }

export function formatMessages(messages: Message[]) {
  return messages.map(formatMessage)
}

function formatMessage(message: Message): string {
  return `${message.rule}: ${formatRuleViolation(message)}`
}

function formatRuleViolation(message: Message): string {
  switch (message.rule) {
    case "cross-feature-nested-imports":
      return `${bold(message.importer)} reaches across a feature boundary into ${bold(message.imported)}`

    case "not-shared-level":
      return formatNotSharedLevel(message)
  }
}

function formatNotSharedLevel(message: NotSharedLevelMessage): string {
  if (message.remedy.kind === "use-barrel") {
    const barrel = message.remedy.barrel
    const viaBarrel = barrel
      ? `re-export it from the barrel ${bold(barrel)} and import it through the barrel instead`
      : `add a barrel to its folder, re-export it from there, and import it through the barrel instead`

    return [
      `${bold(message.component)} is imported directly from outside its folder, bypassing the barrel; ${viaBarrel}:`,
      ...formatComponentTree(message.component, message.dependents, "← export via barrel"),
    ].join("\n")
  }

  return [
    `${bold(message.component)} should be moved to the shared level ${bold(message.remedy.suggestedLocation)}; it sits apart from the importers that converge there:`,
    ...formatComponentTree(message.component, message.dependents, "← component to move"),
  ].join("\n")
}

interface TreeNode {
  children: Map<string, TreeNode>
  isComponent?: boolean
}

/**
 * Renders the component together with its importing modules as a tree rooted at
 * the directory they all share, so it is visible at a glance that the component
 * sits apart from the importers that converge elsewhere. Paths are shown
 * relative to that root, single-child chains are collapsed (e.g.
 * `polls/PollEditor/index.tsx`) to keep it compact, the component is
 * highlighted, and the importers are colored to set them apart from the plain
 * directory branches.
 */
function formatComponentTree(component: string, dependents: string[], componentNote: string): string[] {
  const root = findCommonPathsPrefix([component, ...dependents].map(path => path.split("/")))
  const tree: TreeNode = { children: new Map() }

  insertPath(tree, component.split("/").slice(root.length)).isComponent = true
  for (const dependent of dependents) {
    insertPath(tree, dependent.split("/").slice(root.length))
  }

  // Anchor the relative paths with the shared level they all hang off.
  return [bold(root.join("/")), ...renderTree(tree, "", componentNote)]
}

function insertPath(tree: TreeNode, segments: string[]): TreeNode {
  let node = tree

  for (const segment of segments) {
    let child = node.children.get(segment)
    if (!child) {
      child = { children: new Map() }
      node.children.set(segment, child)
    }
    node = child
  }

  return node
}

function renderTree(node: TreeNode, prefix: string, componentNote: string): string[] {
  const lines: string[] = []
  const entries = [...node.children.entries()]

  entries.forEach(([name, child], index) => {
    const isLast = index === entries.length - 1

    let label = name
    let current = child

    while (current.children.size === 1) {
      const entry = current.children.entries().next()
      if (entry.done) break

      const [childName, grandchild] = entry.value
      label += `/${childName}`
      current = grandchild
    }

    lines.push(
      `${prefix}${isLast ? "└─ " : "├─ "}${decorateNode(label, current, componentNote)}`,
      ...renderTree(current, `${prefix}${isLast ? "   " : "│  "}`, componentNote),
    )
  })

  return lines
}

function decorateNode(label: string, node: TreeNode, componentNote: string): string {
  // The component is the element to act on; importer leaves are colored to set
  // them apart from the plain directory branches.
  if (node.isComponent) {
    return `${yellow(label)} ${dim(componentNote)}`
  }

  const isImporter = node.children.size === 0
  return isImporter ? cyan(label) : label
}
