import type { ComponentProps, ComponentType } from "react"

/** Extracts the type of the `onError` callback from a flow component. */
export type GetFlowErrorHandler<TFlow extends ComponentType<any>> = NonNullable<ComponentProps<TFlow>["onError"]>

/** Extracts the props type of a form component (by key) from a flow component. */
export type GetFormPropsFromFlow<
  TFlow extends ComponentType<any>,
  TFormKey extends keyof ComponentProps<TFlow>,
> = ComponentProps<Extract<ComponentProps<TFlow>[TFormKey], ComponentType<any>>>
