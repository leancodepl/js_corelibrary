# @leancodepl/folder-structure-cruiser

Validates folder structure rules and enforces cross-feature import restrictions in TypeScript/JavaScript projects.

## Installation

```sh
npm install -D @leancodepl/folder-structure-cruiser
```

## Commands

Every command accepts the same options:

- `-d, --directory <dir>` - Directory (or file) to analyze. Defaults to the current directory
- `-c, --config <path>` - Path to a [config file](#configuration). When omitted,
  `folder-structure-cruiser.config.{json,mjs,js,cjs}` is looked up in the working directory; with no config present the
  command runs with built-in defaults

A command exits with code `1` when it finds violations.

### `validate-cross-feature-imports`

```sh
npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports --directory "src"
```

Reports imports that reach into another feature deeper than its immediate children. Imports are allowed only if they
meet one of these conditions:

1. **Inside module directory**: Import is within the same module
   - ✅ `src/feature1/subfeature1/ComponentA` → `src/feature1/subfeature1/ComponentB`

2. **Sibling's immediate child**: Import is from an immediate sibling's or ancestors siblings' child
   - ✅ `src/feature1/subfeature1/ComponentA` → `src/feature1/subfeature2/ComponentB`

### `validate-shared-components`

```sh
npx @leancodepl/folder-structure-cruiser validate-shared-components --directory "src"
```

Identifies components that should be moved to shared levels when:

- Multiple dependents use the same component
- The component is not positioned at the first shared level among its dependents

### `validate-no-orphans`

```sh
npx @leancodepl/folder-structure-cruiser validate-no-orphans --directory "src"
```

Reports orphaned modules — files that nothing imports and that import nothing themselves.

## Configuration

All commands share one optional config file, by default `folder-structure-cruiser.config.json` (a `.mjs`/`.js`/`.cjs`
module with a default export works too) in the working directory:

```json
{
  "tsConfig": "./tsconfig.json",
  "ignore": ["^src/generated/"],
  "crossFeatureImports": {
    "ignore": ["^src/routes/", "^src/routeTree[.]gen[.]ts$", "^src/main[.]tsx$"]
  },
  "sharedComponents": {
    "ignore": []
  },
  "noOrphans": {
    "ignore": []
  }
}
```

| Option                       | Type       | Description                                                                                             |
| ---------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `tsConfig`                   | `string`   | Path to a tsconfig for path-alias resolution, relative to the config file                               |
| `webpackConfig`              | `string`   | Path to a webpack config for alias resolution, relative to the config file                              |
| `ignore`                     | `string[]` | Ignore patterns applied to **every** command                                                            |
| `scope`                      | `string[]` | When set, only modules matching one of these patterns take part in the analysis (e.g. `["^src/"]`)      |
| `crossFeatureImports.ignore` | `string[]` | Extra ignore patterns for `validate-cross-feature-imports` only                                         |
| `sharedComponents.ignore`    | `string[]` | Extra ignore patterns for `validate-shared-components` only                                             |
| `noOrphans.ignore`           | `string[]` | Extra ignore patterns for `validate-no-orphans` only                                                    |
| `dependencyCruiserOptions`   | `object`   | [Escape hatch](#escape-hatch-raw-dependency-cruiser-options) with raw dependency-cruiser cruise options |

### Ignore patterns

Each `ignore` entry is a **regular expression** matched against module paths relative to the working directory. Matched
modules are left out of the analysis entirely, so neither they nor imports into them are reported.

User patterns are **appended** to the built-in ignores — they never replace them. The built-ins cover `node_modules`,
dotfile configs (e.g. `.prettierrc.json`), `.d.ts` declaration files and `tsconfig.json`.

Per-command `ignore` lists are applied on top of the global one, so paths like route entry points can be exempted from
the cross-feature check while still being validated by the other commands.

### Escape hatch: raw dependency-cruiser options

The analysis runs on [dependency-cruiser](https://github.com/sverweij/dependency-cruiser). When `ignore`/`scope` can't
express what you need, `dependencyCruiserOptions` accepts raw
[cruise options](https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md), deep-merged over the
built-in ones. The contents are not validated and depend on dependency-cruiser internals, and the built-in ignores are
always kept — so prefer `ignore`/`scope` whenever they suffice.

## API

All commands are also available programmatically. Each takes the same parameters and returns the number of detected
violations:

```typescript
import { validateCrossFeatureImports } from "@leancodepl/folder-structure-cruiser"

const violations = await validateCrossFeatureImports({
  directories: ["src"],
  configPath: "./folder-structure-cruiser.config.json", // optional
})
```

- `validateCrossFeatureImports(params)` - Validates cross-feature nested imports according to folder structure rules
- `validateSharedComponent(params)` - Validates if shared components are located at the first shared level
- `validateNoOrphans(params)` - Validates that no orphaned modules exist

**Parameters (`ValidateParams`):**

- `directories: string[]` - Directory or file paths to analyze
- `configPath?: string` - Path to the config file. When omitted, the default file names are looked up in the working
  directory

**Returns:** `Promise<number>` - Number of detected violations

**Throws:** `Error` - Throws an error if the analysis fails or the config is invalid

## Nx Configuration

Configure folder-structure-cruiser commands as an Nx target in your `project.json`. With a
`folder-structure-cruiser.config.json` next to the project, no flags are needed:

```json
"folder-structure": {
  "executor": "nx:run-commands",
  "defaultConfiguration": "validate-cross-feature-imports",
  "options": {
    "cwd": "{projectRoot}"
  },
  "configurations": {
    "validate-cross-feature-imports": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports"
    },
    "validate-shared-components": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-shared-components"
    },
    "validate-no-orphans": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-no-orphans"
    }
  }
}
```

## Migrating from dependency-cruiser configs (≤ 10.3)

Earlier versions were configured through dependency-cruiser config files. See [MIGRATION.md](./MIGRATION.md) for a
step-by-step guide to moving onto the built-in [config file](#configuration).
