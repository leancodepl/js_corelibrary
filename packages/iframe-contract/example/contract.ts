import type { HostMethods, RemoteMethods, RemoteParams } from "./types"
import { createContract } from "../src"

export const { useConnectToRemote, useConnectToHost, parseUrlParams, ConnectToHostProvider, useConnectToHostContext } =
  createContract<HostMethods, RemoteMethods, RemoteParams>({
    contractVersion: "1.2.3",
    contractVersionRange: ">=1.0.5 <2.0.0",
  })
