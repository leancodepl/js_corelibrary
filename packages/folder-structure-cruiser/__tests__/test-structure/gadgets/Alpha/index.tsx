// `shared_` is opaque, so Widget reads as living directly under `gadgets`,
// the first level shared by Alpha and Beta — it must not be flagged.
import { Widget } from "../shared_/Widget"

export function Alpha() {
  return <Widget />
}
