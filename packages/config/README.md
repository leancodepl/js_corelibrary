# @leancodepl/config - Utility for creating configuration getters that access Vite-injected values in development and environment variables in production.

Provides a function to create getters for accessing configuration values prefixed with 'VITE_' from `import.meta.env` during development. In production, it retrieves values directly from environment variables, with support for tools like nginx-base from "leancodepl/tools" for parsing.

## Installation

```bash
npm install @leancodepl/config
```

or

```bash
yarn add @leancodepl/config
```

## API

### `mkGetInjectedConfig()`

Creates a getter function for accessing Vite-injected configuration values from environment variables on development, on production it will return the value from the environment variables. You can check "@leancodepl/tools" repository for more information. There's nginx-base defined which parses it out.

The keys are automatically prefixed with 'VITE_' when accessing import.meta.env.

**Returns:** An object containing the `getInjectedConfig` method.

**It's important to not rename `getInjectedConfig` as it's used later as a pattern to search for**

## Usage Examples

### Accessing Configuration Values

```typescript
import { mkGetInjectedConfig } from "@leancodepl/config";

const { getInjectedConfig } = mkGetInjectedConfig<"API_URL" | "API_KEY">();

export const const apiUrl = getInjectedConfig("API_URL");
```
