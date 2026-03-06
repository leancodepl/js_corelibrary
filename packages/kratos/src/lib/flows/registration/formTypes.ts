import type { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import type { RegistrationFlowProps } from "./registrationFlow"

type WrappedRegistrationFlowType = ComponentType<
  Omit<RegistrationFlowProps<any, any>, "oidcProvidersConfig" | "traitsConfig">
>

export type GetRegistrationTraitsFormProps<T extends WrappedRegistrationFlowType> = GetFormPropsFromFlow<
  T,
  "traitsForm"
>
export type GetRegistrationChooseMethodFormProps<T extends WrappedRegistrationFlowType> = GetFormPropsFromFlow<
  T,
  "chooseMethodForm"
>
export type GetRegistrationEmailVerificationFormProps<T extends WrappedRegistrationFlowType> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
