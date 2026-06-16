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

**Returns:** `Promise<number>` - Number of detected violations

**Throws:** `Error` - Throws an error if the dependency analysis fails or configuration is invalid

### `validateSharedComponent(cruiseParams)`

Validates if shared components are located at the first shared level.

**Parameters:**

- `cruiseParams: CruiseParams` - Configuration parameters for the dependency analysis
  - `directory: string` - Directory to analyze. Defaults to `".*"` if not provided
  - `configPath: string` - Path to the dependency-cruiser configuration file (e.g., `.dependency-cruiser.js`)
  - `tsConfigPath: string` - Optional path to TypeScript configuration file for enhanced type resolution
  - `webpackConfigPath?: string` - Optional path to webpack configuration file for webpack alias resolution

**Returns:** `Promise<number>` - Number of detected violations

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

3. **Through an opaque directory**: any directory whose name ends with an underscore is [opaque](#opaque-directories)
   and doesn't count toward the nesting depth
   - ✅ `src/feature1/ComponentA` → `src/features_/feature2/ComponentB`

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

### Opaque directories

Some directories only group features together (e.g. a `features/` folder that holds every feature) rather than being a
feature themselves. Counting them toward the nesting depth would make every cross-feature import look one level too
deep. Mark such a directory as **opaque** by ending its name with an underscore — `features_`, `modules_`, etc. Opaque
segments are skipped when measuring how deep an import reaches, so the directory behaves as if it weren't there.

This needs no configuration; it's driven purely by the directory name. With a `src/features_/` container:

- ✅ `src/features_/featureA/X` → `src/features_/featureB/Y` (`features_` is skipped, so these read as sibling features)
- ✅ `src/featureA/X` → `src/features_/featureB/Y` (`featureB` is a top-level feature once `features_` is skipped)
- ❌ `src/featureA/X` → `src/features_/featureB/internal/Y` (`internal/Y` is still a grandchild of `featureB`, one level
  too deep)

The trailing-underscore convention is matched verbatim, so a sibling directory like `features` (no underscore) keeps
counting normally.

## Nx Configuration

Configure folder-structure-cruiser commands as Nx target in your `project.json`. Example configuration:

```json
"folder-structure": {
  "executor": "nx:run-commands",
  "defaultConfiguration": "validate-cross-feature-imports",
  "configurations": {
    "validate-cross-feature-imports": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports --config ./.dependency-cruiser.json --tsConfig ./tsconfig.base.json --directory '{projectRoot}'"
    },
    "validate-shared-components": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-shared-components --config ./.dependency-cruiser.json --tsConfig ./tsconfig.base.json --directory '{projectRoot}'"
    },
    "validate-no-orphans": {
      "command": "npx depcruise --ts-config ./tsconfig.base.json --config ./.dependency-cruiser.json '{projectRoot}/.*'"
    }
  }
}
```
