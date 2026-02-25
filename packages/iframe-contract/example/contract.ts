import type { AdminMethods, ImplantMethods, ImplantParams } from "./types"
import { createContract } from "../src"

export const { useConnectToRemote, useConnectToHost, parseUrlParams, ConnectToHostProvider, useConnectToHostContext } =
  createContract<AdminMethods, ImplantMethods, ImplantParams>({
    contractVersion: "1.0.0",
    contractVersionRange: ">=1.0.0 <2.0.0",
  })
