import { ComponentType } from "react"
import type { GetFormPropsFromFlow } from "../formTypes"

export type GetSettingsFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "settingsForm">
export type GetSettingsTraitsFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "traitsForm">
export type GetSettingsOidcFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "oidcForm">
export type GetSettingsNewPasswordFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "newPasswordForm">
export type GetSettingsPasskeysFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "passkeysForm">
export type GetSettingsTotpFormProps<T extends ComponentType<any>> = GetFormPropsFromFlow<T, "totpForm">
