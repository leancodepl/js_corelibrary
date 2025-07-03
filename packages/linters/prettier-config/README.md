# @leancodepl/prettier-config

Shareable Prettier configuration for consistent code formatting.

## Installation

```bash
npm install --save-dev @leancodepl/prettier-config
# or
yarn add --dev @leancodepl/prettier-config
```

## Overview

This package provides a Prettier configuration with opinionated formatting rules for consistent code style across TypeScript projects.

## Usage

### Prettier Config File

```javascript
// prettier.config.js or .prettierrc.js
module.exports = require('@leancodepl/prettier-config');
```

### Extending Configuration

```javascript
// prettier.config.js or .prettierrc.js
const baseConfig = require('@leancodepl/prettier-config');

module.exports = {
  ...baseConfig,
  // Override specific options
  printWidth: 100,
  singleQuote: true,
};
```

## Dependencies

- `prettier`: Code formatter with opinionated defaults
