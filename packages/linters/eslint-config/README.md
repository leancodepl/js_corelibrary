# @leancodepl/eslint-config

ESLint configurations for TypeScript and React projects.

## Installation

```bash
npm install --save-dev @leancodepl/eslint-config
# or
yarn add --dev @leancodepl/eslint-config
```

## Available Configurations

- `base` - Core TypeScript rules with sorting and code quality
- `baseReact` - React-specific rules and JSX formatting
- `imports` - Import/export organization and unused import detection
- `a11y` - Accessibility rules for React components

## API

### `resolveFlatConfig(allModules)`

Resolves ESLint flat config by merging plugins and separating configurations.

**Parameters:**

- `allModules` - Array of ESLint flat config objects to merge

**Returns:** Array containing merged plugins object followed by individual configs

## Usage Examples

### React TypeScript Project

```javascript
// eslint.config.js
import { base, baseReact, imports, a11y } from "@leancodepl/eslint-config"

export default [...base, ...baseReact, ...imports, ...a11y]
```

### Custom Rules

```javascript
// eslint.config.js
import { base, baseReact } from "@leancodepl/eslint-config"

export default [
  ...base,
  ...baseReact,
  {
    rules: {
      "max-params": ["error", { max: 6 }],
      "no-console": "off",
    },
  },
]
```

### Resolving Flat Config

```javascript
// eslint.config.js
import { base, resolveFlatConfig } from "@leancodepl/eslint-config"

const customConfigs = [
  { plugins: { custom: customPlugin }, rules: { "custom/rule": "error" } },
  { plugins: { another: anotherPlugin }, rules: { "another/rule": "warn" } },
]

export default resolveFlatConfig(customConfigs)
```
