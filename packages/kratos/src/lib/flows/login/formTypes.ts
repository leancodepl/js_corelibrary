import type { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import type { LoginFlowProps } from "./loginFlow"

type WrappedLoginFlowType = ComponentType<Omit<LoginFlowProps<any>, "oidcProvidersConfig">>

export type GetLoginChooseMethodFormProps<T extends WrappedLoginFlowType> = GetFormPropsFromFlow<T, "chooseMethodForm">
export type GetLoginSecondFactorFormProps<T extends WrappedLoginFlowType> = GetFormPropsFromFlow<T, "secondFactorForm">
export type GetLoginSecondFactorEmailFormProps<T extends WrappedLoginFlowType> = GetFormPropsFromFlow<
  T,
  "secondFactorEmailForm"
>
export type GetLoginEmailVerificationFormProps<T extends WrappedLoginFlowType> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
