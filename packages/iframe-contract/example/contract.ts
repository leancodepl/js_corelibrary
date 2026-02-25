import type { AdminMethods, ImplantMethods, ImplantParams } from "./types"
import { createContract } from "../src"

export const { useConnectToRemote, useConnectToHost, parseUrlParams, ConnectToHostProvider, useConnectToHostContext } =
  createContract<AdminMethods, ImplantMethods, ImplantParams>({
    contractVersion: "1.2.3",
    contractVersionRange: ">=1.0.5 <2.0.0",
  })
