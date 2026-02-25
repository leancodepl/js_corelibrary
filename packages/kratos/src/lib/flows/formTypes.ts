import type { ComponentProps, ComponentType } from "react"

export type GetFlowErrorHandler<TFlow extends ComponentType<any>> = NonNullable<ComponentProps<TFlow>["onError"]>

export type GetFormPropsFromFlow<
  TFlow extends ComponentType<any>,
  TFormKey extends keyof ComponentProps<TFlow>,
> = ComponentProps<Extract<ComponentProps<TFlow>[TFormKey], ComponentType<any>>>
