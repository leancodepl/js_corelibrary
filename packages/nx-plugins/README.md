# @leancodepl/nx-plugins

Collection of Nx inference plugins for LeanCode projects.

## Installation

```bash
npm install -D @leancodepl/nx-plugins
```

## Available Plugins

### Contracts Generator Plugin

Automatically infers a `contracts` target for projects containing a `contractsgenerator-typescript.config.js` file.

```json
{
  "plugins": [
    {
      "plugin": "@leancodepl/nx-plugins/contracts-generator",
      "options": {
        "targetName": "contracts"
      }
    }
  ]
}
```

### Intl Plugin

Automatically infers translation targets for projects containing an `intl.config.js` file.

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

Inferred targets:

- `intl` - Extract and compile translations locally
- `intl-upload` - Upload terms to POEditor
- `intl-download` - Download translations from POEditor
- `intl-sync` - Upload and download translations
- `intl-diff` - Compare local terms with POEditor

### Proxy Plugin

Automatically infers a `proxy` target for projects containing a `dev/docker-compose.yml` file.

```json
{
  "plugins": [
    {
      "plugin": "@leancodepl/nx-plugins/proxy",
      "options": {
        "targetName": "proxy"
      }
    }
  ]
}
```

The proxy target has two configurations:

- `up` (default): Starts the proxy container
- `rebuild`: Rebuilds the proxy image from Azure Container Registry
