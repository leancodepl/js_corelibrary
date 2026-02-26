import type { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import type { RecoveryFlowProps } from "./recoveryFlow"

type WrappedRecoveryFlowType = ComponentType<RecoveryFlowProps>

export type GetRecoveryEmailFormProps<T extends WrappedRecoveryFlowType> = GetFormPropsFromFlow<T, "emailForm">
export type GetRecoveryCodeFormProps<T extends WrappedRecoveryFlowType> = GetFormPropsFromFlow<T, "codeForm">
export type GetRecoveryNewPasswordFormProps<T extends WrappedRecoveryFlowType> = GetFormPropsFromFlow<
  T,
  "newPasswordForm"
>
