// A downstream app that depends on the built `@leancodepl/config` package.
// Importing the built `dist` by a relative path (rather than a bare specifier)
// guarantees Vite bundles it, so the consumer's own pipeline is what must
// textually replace `import.meta.env` -- exactly the real-world path.
import { mkGetInjectedConfig } from "../../../dist"

const { getInjectedConfig } = mkGetInjectedConfig()

export const result = getInjectedConfig("FOO")
