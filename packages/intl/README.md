# @leancodepl/intl

A command-line tool for managing FormatJS translations with POEditor integration. Extracts messages from
TypeScript/React source files, uploads terms to POEditor, downloads translations, and compiles them for use in
internationalized applications.

## Installation

```sh
npm install -D @leancodepl/intl
```

## Usage

```sh
npx @leancodepl/intl <command> [options]
```

## Configuration

### Config File

Create an `intl.config.js` (or `.intlrc`, `.intlrc.json`, `.intlrc.js`) file in your project root:

```js
module.exports = {
  srcPattern: "src/**/!(*.d).{ts,tsx}",
  outputDir: "lang",
  defaultLanguage: "pl",
  languages: ["pl", "en"],
  poeditorProjectId: 123456,
};
```

### Environment Variables

Configure POEditor credentials using environment variables:

- `POEDITOR_API_TOKEN` - POEditor API token (required for upload, download, sync, and diff commands)
- `POEDITOR_PROJECT_ID` - POEditor project ID (required for upload, download, sync, and diff commands)

### Configuration Priority

Options are resolved in the following order (highest priority first):

1. CLI arguments
2. Environment variables (for POEditor credentials)
3. Config file

## Commands

### `local`

Extracts FormatJS messages from source files. When POEditor credentials are provided, merges extracted messages with
downloaded translations for default language. Downloaded translations are not overridden - only new terms added during
development are added to translations file. Use this command during development to fix build errors after adding new
term in code.

**Usage:**

```sh
npx @leancodepl/intl local [options]
```

**Options:**

- `-s, --src-pattern <pattern>` - Source file pattern for extraction (default: `"src/**/!(*.d).{ts,tsx}"`)
- `-o, --output-dir <dir>` - Output directory for compiled translations (default: `"lang"`)
- `-d, --default-language <lang>` - Default language for translations (required when using POEditor integration)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var)
- `-c, --config <path>` - Path to config file

### `upload`

Extracts FormatJS messages from source files and uploads both terms and default language translations to POEditor.

**Usage:**

```sh
npx @leancodepl/intl upload [options]
```

**Options:**

- `-s, --src-pattern <pattern>` - Source file pattern for extraction (default: `"src/**/!(*.d).{ts,tsx}"`)
- `-d, --default-language <lang>` - Default language for translations (required)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var, required)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var, required)
- `-c, --config <path>` - Path to config file

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
- `-c, --config <path>` - Path to config file

### `sync`

Combines upload and download operations. Uploads extracted terms and default language translations to POEditor, then
downloads and compiles translations for specified languages.

**Usage:**

```sh
npx @leancodepl/intl sync [options]
```

**Options:**

- `-s, --src-pattern <pattern>` - Source file pattern for extraction (default: `"src/**/!(*.d).{ts,tsx}"`)
- `-o, --output-dir <dir>` - Output directory for compiled translations (default: `"lang"`)
- `-l, --languages <langs...>` - Languages to download (space-separated list, required)
- `-d, --default-language <lang>` - Default language for translations (required)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var, required)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var, required)
- `-c, --config <path>` - Path to config file

### `diff`

Compares locally extracted terms with POEditor terms to identify unused terms in the translation service. Helps maintain
clean translation projects by finding orphaned entries.

**Usage:**

```sh
npx @leancodepl/intl diff [options]
```

**Options:**

- `-s, --src-pattern <pattern>` - Source file pattern for extraction (default: `"src/**/!(*.d).{ts,tsx}"`)
- `-t, --poeditor-api-token <token>` - POEditor API token (overrides `POEDITOR_API_TOKEN` env var, required)
- `-p, --poeditor-project-id <id>` - POEditor project ID (overrides `POEDITOR_PROJECT_ID` env var, required)
- `-c, --config <path>` - Path to config file

## Nx Integration

### Using the Nx Plugin

Add the `@leancodepl/nx-plugins/intl` plugin to your `nx.json`:

```json
{
  "plugins": ["@leancodepl/nx-plugins/intl"]
}
```

This will automatically infer targets for any project containing an `intl.config.js` file:

- `intl` - runs the local command
- `intl-upload` - runs the upload command
- `intl-download` - runs the download command
- `intl-sync` - runs the sync command
- `intl-diff` - runs the diff command

### Plugin Options

```json
{
  "plugins": [
    {
      "plugin": "@leancodepl/nx-plugins/intl",
      "options": {
        "localTargetName": "intl",
        "uploadTargetName": "intl-upload",
        "downloadTargetName": "intl-download",
        "syncTargetName": "intl-sync",
        "diffTargetName": "intl-diff"
      }
    }
  ]
}
```

### Manual Nx Configuration

Alternatively, configure intl commands manually as Nx target in your `project.json`:

```json
"intl": {
  "executor": "nx:run-commands",
  "defaultConfiguration": "local",
  "configurations": {
    "local": {
      "command": "npx @leancodepl/intl local"
    },
    "download": {
      "command": "npx @leancodepl/intl download"
    },
    "diff": {
      "command": "npx @leancodepl/intl diff"
    },
    "upload": {
      "command": "npx @leancodepl/intl upload"
    },
    "sync": {
      "command": "npx @leancodepl/intl sync"
    }
  }
}
```

## Local Development

To simplify local development tests can be used with real POEditor integration.

### Running Tests

#### Run tests with POEditor integration

Set the following environment variables:

- `POEDITOR_API_TOKEN`: Your POEditor API token
- `POEDITOR_PROJECT_ID`: Your POEditor project ID

To run specific command run only test for that command. Example for `local` command:

```bash
POEDITOR_API_TOKEN=your_token POEDITOR_PROJECT_ID=your_project_id npx nx test intl -- local.spec.ts
```

Tests will use predefined test project for extracting example messages and will save outputs in
`/__tests__/testProject/lang`. Be careful with running `sync` and `upload` commands. Terms extracted from example
project will be added to your POEditor project!
