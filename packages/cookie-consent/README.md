# @leancodepl/folder-structure-cruiser

Validates folder structure rules and enforces cross-feature import restrictions in TypeScript/JavaScript projects.

## Installation

```sh
npm install -D dependency-cruiser @leancodepl/folder-structure-cruiser
```

## API

### `validateCrossFeatureImports(cruiseParams)`

Validates cross-feature nested imports according to folder structure rules.

**Parameters:**

- `cruiseParams: CruiseParams` - Configuration parameters for the dependency analysis
  - `directory: string` - Directory to analyze. Defaults to `".*"` if not provided
  - `configPath: string` - Path to the dependency-cruiser configuration file (e.g., `.dependency-cruiser.js`)
  - `tsConfigPath: string` - Optional path to TypeScript configuration file for enhanced type resolution
  - `webpackConfigPath?: string` - Optional path to webpack configuration file for webpack alias resolution

**Returns:** `Promise<void>` - The function doesn't return a value but outputs results to console

**Throws:** `Error` - Throws an error if the dependency analysis fails or configuration is invalid

### `validateSharedComponent(cruiseParams)`

Validates if shared components are located at the first shared level.

**Parameters:**

- `cruiseParams: CruiseParams` - Configuration parameters for the dependency analysis
  - `directory: string` - Directory to analyze. Defaults to `".*"` if not provided
  - `configPath: string` - Path to the dependency-cruiser configuration file (e.g., `.dependency-cruiser.js`)
  - `tsConfigPath: string` - Optional path to TypeScript configuration file for enhanced type resolution
  - `webpackConfigPath?: string` - Optional path to webpack configuration file for webpack alias resolution

**Returns:** `Promise<void>` - The function doesn't return a value but outputs results to console

**Throws:** `Error` - Throws an error if the dependency analysis fails or configuration is invalid

## Usage Examples

### Cross-Feature Import Validation

```sh
# Basic validation
npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports --directory "packages/admin" --config "./.dependency-cruiser.json"

# With both TypeScript and webpack config
npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports --directory "packages/admin" --config "./.dependency-cruiser.json" --tsConfig "./tsconfig.base.json" --webpackConfig "./webpack.config.js"
```

### Shared Component Validation

```sh
# Basic validation
npx @leancodepl/folder-structure-cruiser validate-shared-components --directory "packages/admin" --config "./.dependency-cruiser.json"

# With both TypeScript and webpack config
npx @leancodepl/folder-structure-cruiser validate-shared-components --directory "packages/admin" --config "./.dependency-cruiser.json" --tsConfig "./tsconfig.base.json" --webpackConfig "./webpack.config.js"
```

### No-Orphan Rule Validation

```sh
# Use dependency-cruiser directly for no-orphan rule
npx depcruise --config ./.dependency-cruiser.json ./packages/admin/.*

# With TypeScript config
npx depcruise --ts-config ./tsconfig.base.json --config ./.dependency-cruiser.json ./packages/admin/.*

# With both TypeScript and webpack config
npx depcruise --ts-config ./tsconfig.base.json --webpack-config ./webpack.config.js --config ./.dependency-cruiser.json ./packages/admin/.*
```

**Configuration:**

```json
{
  "extends": ["@leancodepl/folder-structure-cruiser/.dependency-cruiser.json"]
}
```

## Features

### Cross-Feature Import Rules

Imports are allowed only if they meet one of these conditions:

1. **Inside module directory**: Import is within the same module
   - ✅ `src/feature1/subfeature1/ComponentA` → `src/feature1/subfeature1/ComponentB`

2. **Sibling's immediate child**: Import is from an immediate sibling's or ancestors siblings' child
   - ✅ `src/feature1/subfeature1/ComponentA` → `src/feature1/subfeature2/ComponentB`

### Shared Component Detection

Identifies components that should be moved to shared levels when:

- Multiple dependents use the same component
- The component is not positioned at the first shared level among its dependents

## Configuration

Create a `.dependency-cruiser.json` file in your project root:

```json
{
  "extends": ["@leancodepl/folder-structure-cruiser/.dependency-cruiser.json"]
}
```

This configuration serves as a base config that can be extended with your own rules.

## Nx Configuration

Configure folder-structure-cruiser commands as Nx target in your `project.json`. Example configuration:

```json
"folder-structure": {
  "executor": "nx:run-commands",
  "defaultConfiguration": "validate-cross-feature-imports",
  "configurations": {
    "validate-cross-feature-imports": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports --config ./.dependency-cruiser.json --ts-config ./tsconfig.base.json --directory '{projectRoot}'"
    },
    "validate-shared-components": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-shared-components --config ./.dependency-cruiser.json --ts-config ./tsconfig.base.json --directory '{projectRoot}'"
    },
    "validate-no-orphans": {
      "command": "npx depcruise --ts-config ./tsconfig.base.json --config ./.dependency-cruiser.json '{projectRoot}/.*'"
    }
  }
}
```
