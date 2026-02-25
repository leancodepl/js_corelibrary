import { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"

export type GetRegistrationTraitsFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "traitsForm">
export type GetRegistrationChooseMethodFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<
  T,
  "chooseMethodForm"
>
export type GetRegistrationEmailVerificationFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
