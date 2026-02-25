import { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"

export type GetRecoveryEmailFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "emailForm">
export type GetRecoveryCodeFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "codeForm">
export type GetRecoveryNewPasswordFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "newPasswordForm">
