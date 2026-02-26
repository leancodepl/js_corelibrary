import type { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import type { VerificationFlowProps } from "./verificationFlow"

type WrappedVerificationFlowType = ComponentType<VerificationFlowProps>

export type GetVerificationEmailVerificationFormProps<T extends WrappedVerificationFlowType> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
