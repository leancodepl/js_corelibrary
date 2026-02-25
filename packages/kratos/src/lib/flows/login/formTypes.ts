import { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"

export type GetLoginChooseMethodFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "chooseMethodForm">
export type GetLoginSecondFactorFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "secondFactorForm">
export type GetLoginSecondFactorEmailFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<
  T,
  "secondFactorEmailForm"
>
export type GetLoginEmailVerificationFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
