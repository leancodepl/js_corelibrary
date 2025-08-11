# @leancodepl/linting

Linting and formatting setup for TypeScript and React projects.

## Installation

```bash
npm install --save-dev @leancodepl/linting
# or
yarn add --dev @leancodepl/linting
```

## Included Packages

- `@leancodepl/eslint-config` - ESLint rules for TypeScript and React
- `@leancodepl/prettier-config` - Prettier formatting configuration
- `@leancodepl/stylelint-config` - Stylelint rules for CSS and SCSS
- `@leancodepl/resolve-eslint-flat-confgi` - TypeScript resolver for ESlint flat config

## Usage Examples

### ESLint Configuration

```javascript
// eslint.config.js
import { base, baseReact, imports, a11y } from "@leancodepl/eslint-config"

export default [...base, ...baseReact, ...imports, ...a11y]
```

### Prettier Configuration

```javascript
// prettier.config.js
module.exports = require("@leancodepl/prettier-config")
```

### Stylelint Configuration

```javascript
// stylelint.config.js
module.exports = {
  extends: "@leancodepl/stylelint-config",
}
```

### ESlint flat config resolver

```javascript
// eslint.config.js
import { base, resolveFlatConfig } from "@leancodepl/eslint-config"

const customConfigs = [
  { plugins: { custom: customPlugin }, rules: { "custom/rule": "error" } },
  { plugins: { another: anotherPlugin }, rules: { "another/rule": "warn" } },
]

export default resolveFlatConfig(customConfigs)
```
