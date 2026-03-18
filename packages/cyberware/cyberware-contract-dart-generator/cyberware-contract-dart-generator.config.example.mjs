import { z } from "zod"
// eslint-disable-next-line @nx/enforce-module-boundaries
import { methodDef, mkZodContractSchema } from "@leancodepl/cyberware-contract"

const schema = mkZodContractSchema({
  hostMethods: {
    navigateTo: methodDef({ params: z.object({ path: z.string() }) }),
  },
  remoteMethods: {
    getCurrentPath: methodDef({ returns: z.string() }),
  },
  remoteParams: { userId: z.string().optional() },
})

const config = {
  schema: schema,
  outputDir: "./example/generated",
}

export default config
