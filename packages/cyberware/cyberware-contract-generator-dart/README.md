# @leancodepl/cyberware-contract-generator-dart

Generates Dart extension type files from an `"@leancodepl/cyberware-contract"` Zod schema, producing type-safe JS
interop code for Flutter web applications.

## Installation

```bash
npm install @leancodepl/cyberware-contract-generator-dart
```

## API

### `generate(config, outputDir)`

Generates Dart extension type files from an iframe contract schema. Produces three files in the output directory:
`contract.dart`, `types.dart`, and `connect_to_host.dart`.

**Parameters:**

- `config` (`Pick<CyberwareContractGeneratorDartConfig, "schema">`) - Configuration containing the Zod contract schema
- `outputDir` (`string`) - Absolute or relative path to the directory where Dart files will be written

### `cyberwareContractGeneratorDartConfigSchema`

Validates the configuration for the Dart code generator.

**Type:** Zod schema that validates to `CyberwareContractGeneratorDartConfig`

**Shape:**

- `schema` (`z.ZodType<ContractSchemaType>`) - A Zod contract schema created with `mkZodContractSchema` from
  `"@leancodepl/cyberware-contract"`
- `outputDir` (`string`) - Directory where Dart files will be written

### `CyberwareContractGeneratorDartConfig`

TypeScript type inferred from `cyberwareContractGeneratorDartConfigSchema`.

## Usage Examples

### CLI

Run the generator from the command line:

```bash
npx cyberware-contract-generator-dart
```

Pass a custom config path:

```bash
npx cyberware-contract-generator-dart --config ./my-config.mjs
```

### Configuration file

Create an `cyberware-contract-generator-dart.config.mjs` in your project root:

```javascript
import { z } from "zod"
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

export default {
  schema,
  outputDir: "./lib/generated",
}
```

### Programmatic usage

```typescript
import { generate } from "@leancodepl/cyberware-contract-generator-dart"
import { mkZodContractSchema, methodDef } from "@leancodepl/cyberware-contract"
import { z } from "zod"

const schema = mkZodContractSchema({
  hostMethods: {
    navigateTo: methodDef({ params: z.object({ path: z.string() }) }),
  },
  remoteMethods: {
    getCurrentPath: methodDef({ returns: z.string() }),
  },
  remoteParams: { userId: z.string() },
})

await generate({ schema }, "./lib/generated")
```

### Validating configuration

```typescript
import { cyberwareContractGeneratorDartConfigSchema } from "@leancodepl/cyberware-contract-generator-dart"

const config = cyberwareContractGeneratorDartConfigSchema.parse({
  schema: myContractSchema,
  outputDir: "./lib/generated",
})
```

## Generated output

The generator produces three Dart files:

- **`contract.dart`** - Extension types wrapping `JSObject` for method parameters and result typedefs
- **`types.dart`** - Host/remote method abstractions, JS interop bridge types, URL parameter accessors, and
  `ConnectToHostState` typedef
- **`connect_to_host.dart`** - Typed `connectToHost` function wiring remote methods and returning host methods

## Configuration

The CLI searches for config files in the following order:

- `cyberware-contract-generator-dart.config.js`
- `cyberware-contract-generator-dart.config.cjs`
- `cyberware-contract-generator-dart.config.mjs`

Alternatively, pass an explicit path with `--config` / `-c`.
