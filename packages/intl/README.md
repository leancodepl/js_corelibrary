# @leancodepl/intl

A comprehensive CLI tool for managing formatjs translations with POEditor integration.

## Installation

```bash
npm install -D @leancodepl/intl
```

## Setup

Configure your POEditor credentials using environment variables:

```bash
export POEDITOR_API_TOKEN=your_poeditor_api_token_here
export POEDITOR_PROJECT_ID=123456
```

## Commands

### `local`
Extract and compile formatjs translations locally (no POEditor integration):

```bash
npx intl local --src-pattern "src/**/*.{ts,tsx}" --output-dir "lang"
```

### `upload`
Extract terms from source files and upload to POEditor:

```bash
npx intl upload --src-pattern "src/**/*.{ts,tsx}"
```

### `download`
Download translations from POEditor and compile them:

```bash
npx intl download --output-dir "lang" --languages en,pl,es
```

### `sync`
Combines upload and download operations:

```bash
npx intl sync --src-pattern "src/**/*.{ts,tsx}" --output-dir "lang"
```

### `diff`
Compare local terms with POEditor to find unused terms:

```bash
npx intl diff --src-pattern "src/**/*.{ts,tsx}"
```



## Configuration

The tool can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `POEDITOR_API_TOKEN` | POEditor API token (required) | - |
| `POEDITOR_PROJECT_ID` | POEditor project ID (required) | - |
| `INTL_SRC_PATTERN` | Source file pattern for extraction | `src/**/*.{ts,tsx}` |
| `INTL_OUTPUT_DIR` | Output directory for compiled translations | `lang` |
| `INTL_LANGUAGES` | Comma-separated list of languages | `en,pl` |
| `INTL_DEFAULT_LANGUAGE` | Default language for translations | `en` |

## Features

- ✅ Extract formatjs messages from TypeScript/React files
- ✅ Upload terms and translations to POEditor
- ✅ Download and compile translations from POEditor
- ✅ Compare local and remote terms to find inconsistencies
- ✅ Full TypeScript support
- ✅ Colorized CLI output
- ✅ OpenAPI client generation for POEditor

## Usage with FormatJS

This tool works with [FormatJS](https://formatjs.io/) message extraction and compilation. Make sure your React components use the `react-intl` library:

```tsx
import { FormattedMessage } from 'react-intl'

function MyComponent() {
  return (
    <FormattedMessage
      id="welcome.message"
      defaultMessage="Welcome to our app!"
      description="Welcome message on homepage"
    />
  )
}
```

## Development

This package is part of the js_corelibrary monorepo.

### Build

```bash
nx build @leancodepl/intl
```

### Generate POEditor API Client (Optional)

The package uses a generated type-safe client from the POEditor OpenAPI schema. To regenerate the client:

```bash
nx run @leancodepl/intl:generate-client
```

**Note:** This requires Java to be installed for the OpenAPI generator.

### Test

```bash
nx test @leancodepl/intl
```

## License

Apache-2.0 