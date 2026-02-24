import { Methods } from "penpal"

export type HostMethodsBase = Methods
export type RemoteMethodsBase = Methods
export type RemoteParamsBase = Record<string, string>
export type RemoteParamsWithContractVersion<TParams extends RemoteParamsBase = RemoteParamsBase> = TParams & {
  contractVersion: string
}
