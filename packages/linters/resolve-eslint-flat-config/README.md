# @leancodepl/resolve-eslint-flat-config

A TypeScript library for resolving ESLint flat config plugin collisions.

## Installation

```bash
npm install --save-dev @leancodepl/resolve-eslint-flat-config
# or
yarn add --dev @leancodepl/resolve-eslint-flat-config
```

## API

### `resolveFlatConfig(allModules)`

Resolves ESLint flat config by merging plugins and separating configurations.

**Parameters:**

- `allModules` (`Linter.Config[]`, **required**) - Array of ESLint flat config objects to merge

**Returns:** Array containing merged plugins object followed by individual configs

## Usage Examples

```javascript
// eslint.config.js
const { resolveFlatConfig } = require("@leancodepl/resolve-eslint-flat-config")

const customConfigs = [
  { plugins: { custom: customPlugin }, rules: { "custom/rule": "error" } },
  { plugins: { another: anotherPlugin }, rules: { "another/rule": "warn" } },
]

module.exports = resolveFlatConfig(customConfigs)
```
