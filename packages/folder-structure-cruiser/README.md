# @leancodepl/folder-structure-cruiser

A command-line tool for validating folder structure rules in LeanCode projects. Enforces cross-feature import
restrictions and identifies shared components that should be moved to appropriate levels.

## Installation

This package requires `dependency-cruiser` to be installed in your project:

```sh
npm install -D dependency-cruiser @leancodepl/folder-structure-cruiser
```

## API

### `validateCrossFeatureImports(directories, excludePaths, tsConfigPath)`

Validates if cross-feature nested imports are allowed according to folder structure rules.

**Parameters:**

- `directories: string[]` - Directories to analyze for cross-feature import violations (default: `[".*"]`)
- `excludePaths: string[]` - Paths to exclude from analysis (default: `[]`)
- `tsConfigPath?: string` - Optional path to TypeScript configuration file

**Example:**

```typescript
import { validateCrossFeatureImports } from "@leancodepl/folder-structure-cruiser"

await validateCrossFeatureImports({
  directories: ["src"],
  excludePaths: ["__tests__"],
  tsConfigPath: "./tsconfig.json",
})
```

### `validateSharedComponent(directories, excludePaths, tsConfigPath)`

Validates if shared components are located at the first shared level.

**Parameters:**

- `directories: string[]` - Directories to analyze for shared component issues (default: `[".*"]`)
- `excludePaths: string[]` - Paths to exclude from analysis (default: `[]`)
- `tsConfigPath?: string` - Optional path to TypeScript configuration file

**Example:**

```typescript
import { validateSharedComponent } from "@leancodepl/folder-structure-cruiser"

await validateSharedComponent({
  directories: ["src"],
  excludePaths: ["__tests__"],
  tsConfigPath: "./tsconfig.json",
})
```

## Usage Examples

### Command Line Interface

```sh
# Validate cross-feature imports
npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports --tsConfig "./tsconfig.base.json" --directory "packages/admin"

# Use dependency-cruiser directly
npx depcruise --ts-config ./tsconfig.base.json --config ./.dependency-cruiser.json ./packages/admin/.*
```

### Programmatic Usage

```typescript
import { validateCrossFeatureImports, validateSharedComponent } from "@leancodepl/folder-structure-cruiser"

// Validate cross-feature imports
await validateCrossFeatureImports({
  directories: ["src/features"],
  excludePaths: ["__tests__", "node_modules"],
  tsConfigPath: "./tsconfig.json",
})

// Validate shared components
await validateSharedComponent({
  directories: ["src/components"],
  excludePaths: ["__tests__"],
  tsConfigPath: "./tsconfig.json",
})
```

### Configuration

Create a `.dependency-cruiser.json` file in your project root:

```json
{
  "extends": ["@leancodepl/folder-structure-cruiser/.dependency-cruiser.json"]
}
```

This configuration serves as a base config that can be extended with your own rules. You can overwrite any options or
add additional rules to customize the validation for your project's specific needs.

## Nx Configuration

Configure folder-structure-cruiser commands as Nx target in your `project.json`. Example configuration:

```json
"folder-structure": {
  "executor": "nx:run-commands",
  "defaultConfiguration": "validate",
  "configurations": {
    "validate": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports --tsConfig './tsconfig.base.json' --directory '{projectRoot}'"
    },
    "shared-components": {
      "command": "npx @leancodepl/folder-structure-cruiser validate-shared-components --tsConfig './tsconfig.base.json' --directory '{projectRoot}'"
    },
    "depcruise": {
      "command": "npx depcruise --ts-config ./tsconfig.base.json --config ./.dependency-cruiser.json '{projectRoot}/.*'"
    }
  }
}
```

## Features

### Cross-Feature Import Rules

Imports are allowed only if they meet one of these conditions:

1. **Inside module directory**: Import is within the same module/sub-feature
   - ✅ `src/feature1/subfeature1/ComponentA` → `src/feature1/subfeature1/ComponentB`

2. **Sibling's immediate child**: Import is from a sibling sub-feature at the same level
   - ✅ `src/feature1/subfeature1/ComponentA` → `src/feature1/subfeature2/ComponentB`

3. **Ancestor's sibling's immediate child**: Import is from a different feature at the same level
   - ✅ `src/feature1/subfeature1/ComponentA` → `src/feature2/ComponentB`

### Shared Component Detection

Identifies components that should be moved to shared levels when:

- Multiple dependents use the same component
- The component is not positioned at the first shared level among its dependents
