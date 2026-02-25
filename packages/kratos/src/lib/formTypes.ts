import { ComponentProps, ComponentType } from "react"

export type GetFlowErrorHandler<TFlow extends ComponentType<any>> = NonNullable<ComponentProps<TFlow>["onError"]>

type GetFormPropsFromFlow<
  TFlow extends ComponentType<any>,
  TFormKey extends keyof ComponentProps<TFlow>,
> = ComponentProps<Extract<ComponentProps<TFlow>[TFormKey], ComponentType<any>>>

export type GetRegistrationTraitsFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "traitsForm">
export type GetRegistrationChooseMethodFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<
  T,
  "chooseMethodForm"
>
export type GetRegistrationEmailVerificationFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>

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

export type GetVerificationEmailVerificationFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<
  T,
  "emailVerificationForm"
>

export type GetSettingsFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "settingsForm">
export type GetSettingsTraitsFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "traitsForm">
export type GetSettingsOidcFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "oidcForm">
export type GetSettingsNewPasswordFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "newPasswordForm">
export type GetSettingsPasskeysFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "passkeysForm">
export type GetSettingsTotpFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "totpForm">

export type GetRecoveryEmailFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "emailForm">
export type GetRecoveryCodeFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "codeForm">
export type GetRecoveryNewPasswordFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "newPasswordForm">
