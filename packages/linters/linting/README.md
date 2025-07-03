# @leancodepl/linting

Complete linting and formatting setup for TypeScript and React projects.

## Overview

This meta-package provides a complete linting and formatting setup by including all LeanCode linting configurations:

- `@leancodepl/eslint-config` - ESLint rules for TypeScript and React
- `@leancodepl/prettier-config` - Prettier formatting configuration  
- `@leancodepl/stylelint-config` - Stylelint rules for CSS and SCSS

## Quick Setup

### 1. Install the Package

```bash
npm install --save-dev @leancodepl/linting
# or
yarn add --dev @leancodepl/linting
```

This automatically installs all three linting configurations.

### 2. Install Required Peer Dependencies

```bash
npm install --save-dev \
  eslint \
  eslint-config-prettier \
  eslint-plugin-react \
  prettier \
  stylelint \
  typescript-eslint
```

### 3. Create Configuration Files

#### ESLint Configuration

```javascript
// eslint.config.js
import { base, baseReact, imports, a11y } from '@leancodepl/eslint-config';

export default [
  ...base,
  ...baseReact,
  ...imports,
  ...a11y,
];
```

#### Prettier Configuration

```javascript
// prettier.config.js
module.exports = require('@leancodepl/prettier-config');
```

#### Stylelint Configuration

```javascript
// stylelint.config.js
module.exports = {
  extends: '@leancodepl/stylelint-config',
};
```

## Included Packages

- `@leancodepl/eslint-config`: ESLint configurations for TypeScript and React
- `@leancodepl/prettier-config`: Prettier formatting rules
- `@leancodepl/stylelint-config`: Stylelint configurations for CSS and SCSS
