# force-update

A library for implementing force update functionality in web applications. It includes utilities to monitor app versions
and prompt users to refresh when a new version is available.

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
2. The `listenOnForceUpdate` function periodically polls this endpoint.
3. When a version mismatch is detected, it triggers the `onNewVersionAvailable` callback.
4. You can then prompt the user to reload or automatically refresh the page.

## Building

Run `nx build force-update` to build the library.

## Running unit tests

Run `nx test force-update` to execute the unit tests via [Jest](https://jestjs.io).
