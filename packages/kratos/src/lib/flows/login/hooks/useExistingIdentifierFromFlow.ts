import { useMemo } from "react"
import { getNodeById } from "../../../utils"
import { useGetLoginFlow } from "./useGetLoginFlow"

export const useExistingIdentifierFromFlow = () => {
  const { data: loginFlow } = useGetLoginFlow()

  return useMemo(() => {
    if (!loginFlow) return undefined

    const node = getNodeById(loginFlow.ui.nodes, "identifier")

    if (!node || node.attributes.node_type !== "input" || typeof node.attributes.value !== "string") {
      return undefined
    }

    return node.attributes.value
  }, [loginFlow])
}
