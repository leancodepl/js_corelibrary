import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("settings_flow")

export const settingsFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
