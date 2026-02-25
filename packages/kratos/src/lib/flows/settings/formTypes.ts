import { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"
import { SettingsFlowProps } from "./settingsFlow"

type SettingsFlowType = ComponentType<Omit<SettingsFlowProps<any, any>, "traitsConfig">>

export type GetSettingsFormProps<T extends SettingsFlowType> = GetFormPropsFromFlow<T, "settingsForm">
export type GetSettingsTraitsFormProps<T extends SettingsFlowType> = GetFormPropsFromFlow<T, "traitsForm">
export type GetSettingsOidcFormProps<T extends SettingsFlowType> = GetFormPropsFromFlow<T, "oidcForm">
export type GetSettingsNewPasswordFormProps<T extends SettingsFlowType> = GetFormPropsFromFlow<T, "newPasswordForm">
export type GetSettingsPasskeysFormProps<T extends SettingsFlowType> = GetFormPropsFromFlow<T, "passkeysForm">
export type GetSettingsTotpFormProps<T extends SettingsFlowType> = GetFormPropsFromFlow<T, "totpForm">
