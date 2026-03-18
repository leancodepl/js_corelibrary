import { Methods, RemoteProxy as PenpalRemoteProxy } from "penpal"

export type HostMethodsBase = Methods
export type RemoteMethodsBase = Methods
export type RemoteParamsBase = Record<string, string>
export type RemoteParamsWithContractVersion<TParams extends RemoteParamsBase = RemoteParamsBase> = TParams & {
  contractVersion: string
}

export type HostProxy<THost extends HostMethodsBase> = PenpalRemoteProxy<THost>
export type RemoteProxy<TRemote extends RemoteMethodsBase> = PenpalRemoteProxy<TRemote>
