# @leancodepl/stylelint-config

Shareable stylelint configuration for CSS and SCSS with property ordering.

## Installation

```bash
npm install --save-dev @leancodepl/stylelint-config
# or
yarn add --dev @leancodepl/stylelint-config
```

## Overview

This package provides stylelint configurations for CSS and SCSS with opinionated rules for code quality, consistency, and property ordering.

## Usage

### Basic Config

```javascript
// stylelint.config.js or .stylelintrc.js
module.exports = {
  extends: '@leancodepl/stylelint-config',
};
```

### Extending Configuration

```javascript
// stylelint.config.js or .stylelintrc.js
module.exports = {
  extends: '@leancodepl/stylelint-config',
  rules: {
    // Override specific rules
    'length-zero-no-unit': null,
    'color-hex-case': 'upper',
  },
};
```

## Dependencies

- `prettier`: Code formatter integration
- `stylelint`: CSS linter
- `stylelint-config-recommended-scss`: Base SCSS configuration
- `stylelint-order`: Property ordering plugin
- `stylelint-prettier`: Prettier integration
- `stylelint-rscss`: RSCSS methodology support
