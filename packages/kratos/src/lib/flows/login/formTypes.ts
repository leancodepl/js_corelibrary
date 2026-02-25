import { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import { LoginFlowProps } from "./loginFlow"

type LoginFlowType = ComponentType<LoginFlowProps<any>>

export type GetLoginChooseMethodFormProps<T extends LoginFlowType> = GetFormPropsFromFlow<T, "chooseMethodForm">
export type GetLoginSecondFactorFormProps<T extends LoginFlowType> = GetFormPropsFromFlow<T, "secondFactorForm">
export type GetLoginSecondFactorEmailFormProps<T extends LoginFlowType> = GetFormPropsFromFlow<
  T,
  "secondFactorEmailForm"
>
export type GetLoginEmailVerificationFormProps<T extends LoginFlowType> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
