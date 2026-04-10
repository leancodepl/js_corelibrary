export { connectToHost, type ConnectToHostOptions, connectToRemote, type ConnectToRemoteOptions } from "./lib/connect"
export {
  useConnectToRemote,
  type UseConnectToRemoteOptions,
  type UseConnectToRemoteResult,
} from "./lib/useConnectToRemote"
export {
  type ConnectToHostState,
  useConnectToHost,
  type UseConnectToHostOptions,
  type UseConnectToHostResult,
} from "./lib/useConnectToHost"
export { createConnectToHostProvider } from "./lib/ConnectToHostProvider"
export { buildRemoteUrl, getUrlParams } from "./lib/urlParams"
export { createContract, type CreateContractOptions } from "./lib/createContract"
export { ConnectStatus } from "./lib/enums"
export type { HostProxy, RemoteProxy } from "./lib/types"
export {
  ContractSchema,
  type ContractSchemaType,
  type HostMethodsSchemaBase,
  type InferMethodsFromSchema,
  type InferParamsFromSchema,
  methodDef,
  type MethodDefInferred,
  MethodDefInferredSchema,
  type MethodDefOutput,
  type MethodParamsType,
  type MethodReturnType,
  type MethodType,
  mkZodContractSchema,
  type RemoteMethodsSchemaBase,
  type RemoteParamsSchemaBase,
} from "./lib/zod"
