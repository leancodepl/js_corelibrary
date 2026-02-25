import type { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import type { VerificationFlowProps } from "./verificationFlow"

type VerificationFlowType = ComponentType<VerificationFlowProps>

export type GetVerificationEmailVerificationFormProps<T extends VerificationFlowType> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
