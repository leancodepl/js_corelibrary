import { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import { RecoveryFlowProps } from "./recoveryFlow"

type RecoveryFlowType = ComponentType<RecoveryFlowProps>

export type GetRecoveryEmailFormProps<T extends RecoveryFlowType> = GetFormPropsFromFlow<T, "emailForm">
export type GetRecoveryCodeFormProps<T extends RecoveryFlowType> = GetFormPropsFromFlow<T, "codeForm">
export type GetRecoveryNewPasswordFormProps<T extends RecoveryFlowType> = GetFormPropsFromFlow<T, "newPasswordForm">
