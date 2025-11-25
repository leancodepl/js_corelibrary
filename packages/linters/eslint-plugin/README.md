# @leancodepl/eslint-plugin

ESLint plugin with custom rules for LeanCode projects.

## Installation

```bash
npm install --save-dev @leancodepl/eslint-plugin
# or
yarn add --dev @leancodepl/eslint-plugin
```

## Usage

```javascript
// eslint.config.js
import { leancodePlugin } from "@leancodepl/eslint-plugin"

export default [
  {
    plugins: {
      "@leancodepl/eslint-plugin": leancodePlugin,
    },
    rules: {
      "@leancodepl/eslint-plugin/switch-case-braces": "error",
    },
  },
]
```

## Rules

### `switch-case-braces`

Enforces consistent use of braces in switch case statements. Requires braces when lexical declarations (const, let,
class, function) are present, and suggests removing braces when they are not needed.

**Valid:**

```javascript
switch (value) {
  case "a":
    console.log("a")
    break
  case "b": {
    const x = 1
    console.log(x)
    break
  }
}
```

**Invalid:**

```javascript
switch (value) {
  case "a": {
    console.log("a") // Unnecessary braces
    break
  }
  case "b":
    const x = 1 // Missing braces for lexical declaration
    console.log(x)
    break
}
```
