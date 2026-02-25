import type { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import type { RegistrationFlowProps } from "./registrationFlow"

type RegistrationFlowType = ComponentType<Omit<RegistrationFlowProps<any, any>, "traitsConfig">>

export type GetRegistrationTraitsFormProps<T extends RegistrationFlowType> = GetFormPropsFromFlow<T, "traitsForm">
export type GetRegistrationChooseMethodFormProps<T extends RegistrationFlowType> = GetFormPropsFromFlow<
  T,
  "chooseMethodForm"
>
export type GetRegistrationEmailVerificationFormProps<T extends RegistrationFlowType> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
