import { createQueryKey, withQueryKeyPrefix } from "../../../utils"

const baseKey = withQueryKeyPrefix("settings_flow")

export const settingsFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
