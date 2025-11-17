# @leancodepl/styled-tools

TypeScript utilities for styled-components with type-safe theme access.

## Installation

```bash
npm install @leancodepl/styled-tools
# or
yarn add @leancodepl/styled-tools
```

## API

### `mkTheme()`

Creates type-safe theme utilities for styled-components with full TypeScript support.

**Returns:** Object containing `theme` proxy and `useTheme` hook

## Usage Examples

### Basic Setup

```typescript
// theme.ts
import { mkTheme } from "@leancodepl/styled-tools"
import styled from "styled-components"

interface AppTheme {
  colors: { primary: string; secondary: string }
  spacing: { small: string; large: string }
}

export const { theme, useTheme } = mkTheme<AppTheme>()

const Button = styled.button`
  color: ${theme.colors.primary};
  padding: ${theme.spacing.small};
`
```

### React Hook Usage

```typescript
import React from 'react';
import { useTheme } from './theme';

function ThemedComponent() {
  const theme = useTheme();

  return (
    <div style={{ backgroundColor: theme.colors.primary }}>
      <h1>Themed Component</h1>
    </div>
  );
}
```
