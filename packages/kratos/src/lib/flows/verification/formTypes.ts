import { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"

export type GetVerificationEmailVerificationFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>
