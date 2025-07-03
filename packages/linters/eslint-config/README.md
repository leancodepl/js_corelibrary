# @leancodepl/eslint-config

Shareable ESLint configurations for TypeScript and React projects.

## Installation

```bash
npm install --save-dev @leancodepl/eslint-config
# or
yarn add --dev @leancodepl/eslint-config
```

## Overview

This package provides ESLint configurations for TypeScript and React projects with opinionated rules for code quality, consistency, and best practices.

## Available Configurations

- `base` - Core TypeScript rules with sorting and code quality
- `baseReact` - React-specific rules and JSX formatting  
- `imports` - Import/export organization and unused import detection
- `a11y` - Accessibility rules for React components

## Usage Examples

### React TypeScript Project

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

## Required Peer Dependencies

```bash
npm install --save-dev \
  eslint \
  eslint-config-prettier \
  eslint-plugin-react \
  prettier \
  typescript-eslint
```

## Customization

### Extending Configuration

```javascript
// eslint.config.js
import { base, baseReact, imports } from '@leancodepl/eslint-config';

export default [
  ...base,
  ...baseReact,
  ...imports,
  {
    // Team-specific overrides
    rules: {
      'max-params': ['error', { max: 6 }], // Allow more params
      'no-console': 'off', // Allow console in development
      '@typescript-eslint/no-explicit-any': 'warn', // Warn instead of off
    },
  },
];
```

## Dependencies

- `eslint-plugin-import`: Import/export linting
- `eslint-plugin-jsx-a11y`: Accessibility linting
- `eslint-plugin-perfectionist`: Code sorting and organization
- `eslint-plugin-react-hooks`: React Hooks linting
- `eslint-plugin-unused-imports`: Unused import detection
- `globals`: Global variable definitions
