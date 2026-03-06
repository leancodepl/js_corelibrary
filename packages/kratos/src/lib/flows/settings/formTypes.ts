import type { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import type { SettingsFlowProps } from "./settingsFlow"

type WrappedSettingsFlowType = ComponentType<Omit<SettingsFlowProps<any, any>, "oidcProvidersConfig" | "traitsConfig">>

export type GetSettingsFormProps<T extends WrappedSettingsFlowType> = GetFormPropsFromFlow<T, "settingsForm">
export type GetSettingsTraitsFormProps<T extends WrappedSettingsFlowType> = GetFormPropsFromFlow<T, "traitsForm">
export type GetSettingsOidcFormProps<T extends WrappedSettingsFlowType> = GetFormPropsFromFlow<T, "oidcForm">
export type GetSettingsNewPasswordFormProps<T extends WrappedSettingsFlowType> = GetFormPropsFromFlow<
  T,
  "newPasswordForm"
>
export type GetSettingsPasskeysFormProps<T extends WrappedSettingsFlowType> = GetFormPropsFromFlow<T, "passkeysForm">
export type GetSettingsTotpFormProps<T extends WrappedSettingsFlowType> = GetFormPropsFromFlow<T, "totpForm">
