// Forbidden: reaches a grandchild of the feature behind the opaque directory
import { Deep } from "../../features_/test/internal/Deep"

export function OpaqueDeepConsumer() {
  return <Deep />
}
