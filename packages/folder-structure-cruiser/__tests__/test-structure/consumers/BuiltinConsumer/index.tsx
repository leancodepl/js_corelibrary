import { readFileSync } from "node:fs"
// @ts-expect-error -- intentionally unresolvable: the cruise must classify it as an external (npm) dependency
import unresolvablePackage from "some-unresolvable-package"

export function BuiltinConsumer() {
  return (
    <div>
      {String(readFileSync)}
      {String(unresolvablePackage)}
    </div>
  )
}
