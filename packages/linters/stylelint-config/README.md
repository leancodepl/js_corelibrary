# @leancodepl/stylelint-config

Stylelint configuration for CSS and SCSS with property ordering.

## Installation

```bash
npm install --save-dev @leancodepl/stylelint-config
# or
yarn add --dev @leancodepl/stylelint-config
```

## Usage Examples

### Basic Setup

```javascript
// stylelint.config.js
module.exports = {
  extends: "@leancodepl/stylelint-config",
}
```

### With Overrides

```javascript
// stylelint.config.js
module.exports = {
  extends: "@leancodepl/stylelint-config",
  rules: {
    "length-zero-no-unit": null,
    "color-hex-case": "upper",
  },
}
```
