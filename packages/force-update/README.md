# @leancodepl/force-update

A library for implementing force update functionality in web applications.

## Installation

```bash
npm install @leancodepl/force-update
# or
yarn add @leancodepl/force-update
```

## Overview

This package provides utilities to monitor application versions and prompt users to refresh when a new version is
available. It includes a Vite plugin for version endpoint creation and utilities for user notification on new version
available.

## API

### `listenOnForceUpdate(params)`

Sets up version monitoring with customizable callback and polling interval.

**Parameters:**

- `params: ForceUpdateParams` - Configuration object for force update listening
- `params.onNewVersionAvailable: () => void` - Callback function triggered when a new version is detected
- `params.versionCheckIntervalPeriod?: number` - Optional polling interval in milliseconds (default: 3 minutes)

**Returns:** Cleanup function to stop version monitoring

### `ForceUpdateNotification(props)`

React component that displays a browser prompt when a new version is available.

**Parameters:**

- `props.message?: string` - Optional custom message for notification prompt

**Returns:** React component that handles version checking and user notification

### `vitePluginForceUpdate(options)`

Vite plugin that creates a `/version` endpoint serving the current app version.

**Parameters:**

- `options: ForceUpdatePluginOptions` - Configuration options for the Vite plugin
- `options.envVariableName?: string` - Optional environment variable name (default: 'APP_VERSION')

**Returns:** Vite plugin instance

## Usage

### 1. Setup Version Monitoring

```typescript
import { listenOnForceUpdate } from "@leancodepl/force-update"

useEffect(() => {
    const cleanup = listenOnForceUpdate({
        onNewVersionAvailable: () => {
            // Show notification to user or force reload
            if (window.confirm("A new version is available. Reload now?")) {
                window.location.reload()
            }
        },
        versionCheckIntervalPeriod: 5 * 60 * 1000, // Check every 5 minutes (optional)
    })

    return cleanup
}, [])
```

You can also use component with default behavior - displaying browser prompt with `window.confirm`.

```typescript
import { ForceUpdateNotification } from "@leancodepl/force-update"

<ForceUpdateNotification
    message="A new version of the app is available. Please reload the page to access latest features."
/>
```

### 2. Vite Plugin Setup

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from "vite"
import { vitePluginForceUpdate } from "@leancodepl/force-update"

export default defineConfig({
    plugins: [vitePluginForceUpdate()],
})
```

### 3. Set Environment Variable

Set the `APP_VERSION` environment variable during build.

## How It Works

1. The Vite plugin reads the `APP_VERSION` environment variable and creates a `/version` endpoint that serves the
   current version. Environment variable name can be overridden.
2. The `listenOnForceUpdate` fetches initial version from the endpoint and then periodically polls it.
3. When a version mismatch is detected, it triggers the `onNewVersionAvailable` callback.
4. You can then prompt the user to reload or automatically refresh the page.
