# @leancodepl/intl

A command-line tool for managing FormatJS translations with POEditor integration. Extracts messages from TypeScript/React source files, uploads terms to POEditor, downloads translations, and compiles them for use in internationalized applications.

## Installation

```sh
npm install -D @leancodepl/intl
```

## Usage

```sh
npx @leancodepl/intl <command> [options]
```

## Configuration

Configure POEditor credentials using environment variables:

- `POEDITOR_API_TOKEN` - POEditor API token (required for upload, download, sync, and diff commands)
- `POEDITOR_PROJECT_ID` - POEditor project ID (required for upload, download, sync, and diff commands)

## Commands

### `local`

Extracts FormatJS messages from source files. When POEditor credentials are provided, merges extracted messages with downloaded translations for default language.
Downloaded translations are not overridden - only new terms added during development are added to translations file. 
Use this command during development to fix build errors after adding new term in code.

**Usage:**
```sh
npx @leancodepl/intl local [options]
```

**Options:**
- `-s, --src-pattern <pattern>` - Source file pattern for extraction (default: `"src/**/*.{ts,tsx}"`)
- `-o, --output-dir <dir>` - Output directory for compiled translations (default: `"lang"`)
- `-d, --default-language <lang>` - Default language for translations (required when using POEditor integration)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var)



### `upload`

Extracts FormatJS messages from source files and uploads both terms and default language translations to POEditor.

**Usage:**
```sh
npx @leancodepl/intl upload [options]
```

**Options:**
- `-s, --src-pattern <pattern>` - Source file pattern for extraction (default: `"src/**/*.{ts,tsx}"`)
- `-d, --default-language <lang>` - Default language for translations (required)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var, required)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var, required)

### `download`

Downloads translations from POEditor for specified languages and compiles them to JSON files.

**Usage:**
```sh
npx @leancodepl/intl download [options]
```

**Options:**
- `-o, --output-dir <dir>` - Output directory for compiled translations (default: `"lang"`)
- `-l, --languages <langs...>` - Languages to download (space-separated list, required)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var, required)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var, required)

### `sync`

Combines upload and download operations. Uploads extracted terms and default language translations to POEditor, then downloads and compiles translations for specified languages.

**Usage:**
```sh
npx @leancodepl/intl sync [options]
```

**Options:**
- `-s, --src-pattern <pattern>` - Source file pattern for extraction (default: `"src/**/*.{ts,tsx}"`)
- `-o, --output-dir <dir>` - Output directory for compiled translations (default: `"lang"`)
- `-l, --languages <langs...>` - Languages to download (space-separated list, required)
- `-d, --default-language <lang>` - Default language for translations (required)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var, required)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var, required)

### `diff`

Compares locally extracted terms with POEditor terms to identify unused terms in the translation service. Helps maintain clean translation projects by finding orphaned entries.

**Usage:**
```sh
npx @leancodepl/intl diff [options]
```

**Options:**
- `-s, --src-pattern <pattern>` - Source file pattern for extraction (default: `"src/**/*.{ts,tsx}"`)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var, required)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var, required)

## Nx Configuration

Configure intl commands as Nx target in your `project.json`. Example configuration:

```json
"intl": {
  "executor": "nx:run-commands",
  "defaultConfiguration": "local",
  "configurations": {
    "local": {
      "command": "npx @leancodepl/intl local --src-pattern 'src/**/*.{ts,tsx}' --output-dir '{projectRoot}/lang' --default-language pl --poeditor-project-id 123456"
    },
    "download": {
      "command": "npx @leancodepl/intl download --output-dir '{projectRoot}/lang' --languages pl en --poeditor-project-id 123456"
    },
    "diff": {
      "command": "npx @leancodepl/intl diff --src-pattern 'src/**/*.{ts,tsx}' --poeditor-project-id 123456"
    },
    "upload": {
      "command": "npx @leancodepl/intl upload --src-pattern 'src/**/*.{ts,tsx}' --default-language pl --poeditor-project-id 123456"
    },
    "sync": {
      "command": "npx @leancodepl/intl sync --src-pattern 'src/**/*.{ts,tsx}' --output-dir '{projectRoot}/lang' --languages pl en --default-language pl --poeditor-project-id 123456"
    }
  }
}
```
