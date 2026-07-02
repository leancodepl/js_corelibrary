// A downstream app that depends on the built `@leancodepl/config` by its public
// package name. The fixture's own Vite build must bundle dist and textually
// replace `import.meta.env` -- exactly the real-world consumer path.
import { mkGetInjectedConfig } from "@leancodepl/config"

const { getInjectedConfig } = mkGetInjectedConfig()

export const result = getInjectedConfig("FOO")
