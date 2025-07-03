# @leancodepl/styled-tools

TypeScript utilities for styled-components with type-safe theme access.

## Installation

```bash
npm install @leancodepl/styled-tools
# or
yarn add @leancodepl/styled-tools
```

## Overview

This package provides utilities for styled-components that enable type-safe theme access.

## API

### `mkTheme<TTheme>(): { theme: TransformDeep<TTheme>; useTheme: () => TTheme }`

Creates type-safe theme utilities for styled-components.

**Generic Parameters:**
- `TTheme`: Theme object type

**Returns:** Object with `{ theme, useTheme }`
- `theme`: Proxied theme object for use in styled-components
- `useTheme`: Typed React hook for theme access

### Setup

```typescript
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { appTheme } from './theme';
import App from './App';

function Root() {
  return (
    <ThemeProvider theme={appTheme}>
      <App />
    </ThemeProvider>
  );
}

export default Root;
```

## Usage Examples

### Basic Theme Setup

```typescript
import { mkTheme } from '@leancodepl/styled-tools';
import styled, { ThemeProvider } from 'styled-components';

// Define your theme type
interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// Create typed theme utilities
const { theme, useTheme } = mkTheme<AppTheme>();

// Define your theme
const appTheme: AppTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
};

// Use in styled components with full type safety
const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.small} ${theme.spacing.medium};
  }
`;
```

### React Hook Usage

```typescript
import React from 'react';
import { useTheme } from './theme'; // From mkTheme

function ThemedComponent() {
  const theme = useTheme(); // Fully typed theme object

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        padding: theme.spacing.large,
      }}
    >
      <h1 style={{ color: theme.colors.primary }}>
        Themed Component
      </h1>
    </div>
  );
}
```

## Dependencies

- `styled-components`: Peer dependency for CSS-in-JS styling
