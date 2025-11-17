# @leancodepl/api-binary-blob

Blob conversion utilities for ApiBinary with file handling support.

## Installation

```bash
npm install @leancodepl/api-binary-blob
# or
yarn add @leancodepl/api-binary-blob
```

## API

### `fromBlob(blob)`

Converts Blob to ApiBinary asynchronously.

**Parameters:**

- `blob: Blob` - The Blob to convert to ApiBinary

**Returns:** Promise resolving to ApiBinary or undefined if blob is undefined

### `toBlob(apiBinary, contentType)`

Converts ApiBinary to Blob with optional content type.

**Parameters:**

- `apiBinary: ApiBinary` - The ApiBinary to convert to Blob
- `contentType?: string` - Optional MIME type for the Blob

**Returns:** Blob instance or undefined if apiBinary is null/undefined

## Usage Examples

### File Upload

```typescript
import { fromBlob, toBlob } from "@leancodepl/api-binary-blob"

const handleFileUpload = async (file: File) => {
  const binary = await fromBlob(file)

  await api.post("/upload", {
    fileName: file.name,
    content: binary,
  })
}
```

### File Download

```typescript
import { toBlob } from "@leancodepl/api-binary-blob"

const downloadFile = async (binary: ApiBinary, filename: string) => {
  const blob = toBlob(binary, "application/octet-stream")
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}
```

### Image Processing

```typescript
import { fromBlob, toBlob } from "@leancodepl/api-binary-blob"

const processImage = async (imageFile: File) => {
  const binary = await fromBlob(imageFile)

  const processedBlob = toBlob(binary, "image/jpeg")
  const preview = URL.createObjectURL(processedBlob)

  const img = document.createElement("img")
  img.src = preview
  document.body.appendChild(img)
}
```
