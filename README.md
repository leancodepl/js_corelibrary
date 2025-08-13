# js_corelibrary

## Packages

### CQRS Clients

#### `@leancodepl/cqrs-client-base`

Base types and interfaces for CQRS client implementations.

#### `@leancodepl/axios-cqrs-client`

CQRS client with Axios for HTTP communication and type-safe command/query handling.

#### `@leancodepl/react-query-cqrs-client`

TanStack Query CQRS client with hooks for queries, operations, and commands with built-in caching.

#### `@leancodepl/rx-cqrs-client`

RxJS-based CQRS client for reactive command and query operations with observable streams.

### Binary data types and utilities

#### `@leancodepl/api-binary`

Binary data types and utilities for API communication.

#### `@leancodepl/api-binary-blob`

Blob utilities for converting between API binary format and JavaScript Blob objects.

### Dates

#### `@leancodepl/api-date`

Core date and time type definitions for API communication.

#### `@leancodepl/api-date-datefns`

Date and time utilities using date-fns for converting between API date formats and JavaScript Date objects.

#### `@leancodepl/api-date-dayjs`

Date and time utilities using Day.js for converting between API date formats and Day.js objects.

#### `@leancodepl/api-date-utils`

Common utilities for parsing and handling API date formats, including time span parsing functionality.

### Pipe Clients

#### `@leancodepl/hook-pipe-client`

React hooks for real-time data subscriptions using @leancodepl/pipe with WebSocket communication.

#### `@leancodepl/rx-pipe-client`

RxJS-based topic functions for real-time data subscriptions using @leancodepl/pipe with composable operators.

### Authentication & Security

#### `@leancodepl/login-manager`

OAuth2 authentication management with token storage, refresh capabilities, and social login integrations.

#### `@leancodepl/kratos`

Headless React components library for building Ory Kratos authentication flows.

### Development Tools

#### `@leancodepl/linting`

Complete linting and formatting setup for TypeScript and React projects with ESLint, Prettier, and Stylelint.

#### `@leancodepl/eslint-config`

ESLint configurations for TypeScript and React projects with import sorting and accessibility rules.

#### `@leancodepl/prettier-config`

Prettier configuration for consistent code formatting across projects.

#### `@leancodepl/stylelint-config`

Stylelint configuration for CSS and SCSS with property ordering and best practices enforcement.

#### `@leancodepl/folder-structure-cruiser`

Dependency cruiser configuration for enforcing folder structure rules and cross-feature import validation.

#### `@leancodepl/resolve-eslint-flat-config`

ESLint flat config resolver for merging configuration plugins.

### UI & Styling

#### `@leancodepl/styled-tools`

TypeScript utilities for styled-components with type-safe theme access.

### Feature Management

#### `@leancodepl/feature-flags-react-client`

React client for feature flag management using OpenFeature standard.

### Analytics

#### `@leancodepl/gtag`

Type-safe Google Tag Manager data layer integration for web analytics and event tracking.

### Utilities

#### `@leancodepl/utils`

Utility library for common development tasks including assertions, transformations, and React hooks.

#### `@leancodepl/validation`

Validation utilities for handling API responses and error management with custom error codes.

#### `@leancodepl/vite-plugin-favicon`

Vite plugin for generating favicons from source logos with automatic HTML injection and multiple format support.

## Development

### Testing

Run tests for a specific package:

```bash
nx test [package-name]
```

### Building

Build a specific package:

```bash
nx build [package-name]
```

### Linting

Run linting for a specific package:

```bash
nx lint [package-name]
```

## Publishing

1. Create a new branch, name it `release/[version]` e.g. `release/1.2.3`
2. Push that empty branch to the remote (required for the next step to work).
3. Run `npx lerna version [version]` e.g. `npx lerna version 1.2.3`. This command will automatically bump versions
   across all files and push the changes.
4. Create a new pull request for this branch.
5. Go to the `Actions` tab, and then `Release` workflow. Expand the `Run workflow` menu, from the `Tags` tab choose your
   new version and run the workflow.
6. After refreshing the page you should be able to see the workflow running. After it finishes successfully, go back to
   the previously created PR and merge it.
