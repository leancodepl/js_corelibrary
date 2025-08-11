# @leancodepl/vite-plugin-favicon

A Typescript library for generating favicon formats and sizes from a source logo and injecting the HTML tags into the
build output. Extracted from [vite favicon plugin](https://github.com/josh-hemphill/vite-plugin-favicon) and adjusted to
be dev mode compatible.

## Installation

```bash
npm install @leancodepl/vite-plugin-favicon
```

## API

### `ViteFaviconsPlugin(options)`

Creates a Vite plugin for generating favicons from a source logo.

**Parameters:**

- `options` - Configuration options for favicon generation

**Returns:** Vite plugin instance

### `ViteFaviconsPluginOptions`

Configuration options for the Vite favicon plugin.

**Properties:**

- `logo?: string` - Source logo path for favicon generation (default: "assets/logo.png")
- `inject?: boolean` - Whether to inject HTML links and metadata (default: true)
- `favicons?: Partial<FaviconOptions>`
- `outputPath?: string`

## Usage Examples

### Basic Configuration

```javascript
// vite.config.js
import { ViteFaviconsPlugin } from "@leancodepl/vite-plugin-favicon"

export default {
  plugins: [ViteFaviconsPlugin()],
}
```

### Custom Logo Path

```javascript
// vite.config.js
import { ViteFaviconsPlugin } from "@leancodepl/vite-plugin-favicon"

export default {
  plugins: [
    ViteFaviconsPlugin({
      logo: "src/assets/logo.png",
    }),
  ],
}
```

### Advanced Favicon Configuration

```javascript
// vite.config.js
import { ViteFaviconsPlugin } from "@leancodepl/vite-plugin-favicon"

export default {
  plugins: [
    ViteFaviconsPlugin({
      logo: "src/assets/logo.png",
      favicons: {
        appName: "My Application",
        appShortName: "MyApp",
        themeColor: "#ffffff",
        background: "#000000",
        display: "standalone",
      },
    }),
  ],
}
```
