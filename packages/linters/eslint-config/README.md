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

## Migration from CommonJS to ES Modules

Starting from 10.0.0 version, the package is built as an ES Module. If your ESLint configuration currently uses CommonJS
syntax, follow these steps to migrate:

- Rename `eslint.config.js` to `eslint.config.mjs` (if your `package.json` does not have `"type": "module"`)
- Convert `require` statements to `import` syntax
- Replace CommonJS variables like `__dirname` with ES Module equivalents:

  ```javascript
  import { dirname } from "node:path"
  import { fileURLToPath } from "node:url"

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  // or

  const __dirname = import.meta.dirname
  ```

- If importing a CommonJS package with named imports fails, import the default export and destructure separately:

  ```javascript
  import commonjsPackage from "commonjs-package"
  const { someExport } = commonjsPackage
  ```
