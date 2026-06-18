// Allowed: `features_` is opaque, so `test` reads as a top-level feature
import { Test } from "../../features_/test"

export function OpaqueConsumer() {
  return <Test />
}
