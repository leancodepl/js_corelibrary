# @leancodepl/image-uploader

React component for image uploads.

## Installation

```bash
npm install @leancodepl/image-uploader
```

```bash
yarn add @leancodepl/image-uploader
```

## API

### `useUploadImages(value, accept, cropper, onError, onChange)`

Manages image upload state and provides drag-and-drop functionality. Creates a complete image upload solution with file
validation, drag-and-drop support, optional cropping, and duplicate detection. Returns upload state and control
functions.

**Parameters:**

- `value?: FileWithId[]` - Current array of uploaded files with IDs
- `accept?: Accept` - File types to accept (defaults to image types)
- `cropper?: CropperConfig` - Optional cropper configuration for image editing
- `onError?: (errorCode: ErrorCode) => void` - Callback for handling upload errors
- `onChange?: (files: FileWithId[]) => void` - Callback when file list changes

**Returns:** Upload state and control functions including dropzone props

### `tryUploadWithUploadParams(image, getUploadParams)`

Uploads an image file using provided upload parameters. Handles file upload by calling the getUploadParams function to
retrieve upload configuration, then performs a fetch request to upload the file. Returns early if the image is already
uploaded.

**Parameters:**

- `image: FileWithId | UploadedFileWithId` - Image file with ID or already uploaded image with URL
- `getUploadParams: (image: FileWithId) => Promise<UploadParams | null | undefined>` - Function that returns upload
  parameters (URI, method, headers) for the image

**Returns:** Promise resolving to uploaded image with URL

**Throws:** `Error` - When upload params are not defined, image is not defined, or upload fails

### `UploadImages.Root`

Root wrapper component for image upload functionality. Provides upload context to all child UploadImages components and
renders a div container. Must wrap all other UploadImages components to provide shared state.

**Parameters:**

- `uploader: ReturnType<typeof useUploadImages>` - Upload state and functions from `useUploadImages` hook
- `props: HTMLAttributes<HTMLDivElement>` - Additional HTML div attributes

**Returns:** JSX element wrapping children with upload context

### `UploadImages.Zone`

Drag-and-drop zone component for file uploads. Creates an interactive drop zone with file input capabilities. Supports
both click-to-select and drag-and-drop file uploads. Provides drag state to children for visual feedback.

**Parameters:**

- `children: ((props: UploadZoneChildProps) => ReactNode) | ReactNode` - Content or render function receiving drag state
  props
- `props: HTMLAttributes<HTMLDivElement>` - Additional HTML div attributes

**Returns:** JSX element with drag-and-drop upload functionality

### `UploadImages.Files`

Container component for displaying uploaded files. Renders a container for uploaded files and provides current file list
to children. Used to display and manage the collection of uploaded images.

**Parameters:**

- `children: ((props: UploadFilesChildProps) => ReactNode) | ReactNode` - Content or render function receiving files
  array
- `props: HTMLAttributes<HTMLDivElement>` - Additional HTML div attributes

**Returns:** JSX element containing uploaded files

### `UploadImages.File`

Individual file item component with preview and removal functionality. Displays a single uploaded file with preview
image generation and removal capability. Automatically generates image preview data and provides remove function to
children.

**Parameters:**

- `children: ((props: UploadFileItemChildProps) => ReactNode) | ReactNode` - Content or render function receiving file,
  preview, and remove function
- `file: FileWithId` - File object with ID to display
- `props: HTMLAttributes<HTMLDivElement>` - Additional HTML div attributes

**Returns:** JSX element for individual file with preview and controls

### `UploadImages.Cropper`

Image cropper component with editing controls. Provides image cropping functionality with zoom, rotation, and crop area
controls. Processes cropped images and integrates with the upload state management.

**Parameters:**

- `children: ((props: UploadImagesCropperEditorChildProps) => ReactNode) | ReactNode` - Content or render function
  receiving cropper controls

**Returns:** JSX element with cropper editing interface

**Throws:** `Error` - When cropper config is not defined in context

### `UploadImages.CropperEditor`

Visual editor component for image cropping. Renders the interactive crop editor interface using `"react-easy-crop"`.
Provides visual feedback for crop area, zoom, and rotation adjustments.

**Parameters:**

- `style?: CSSProperties` - CSS style object, merged with default positioning styles
- `props: HTMLAttributes<HTMLDivElement>` - Additional HTML div attributes

**Returns:** JSX element with interactive crop editor

**Throws:** `Error` - When cropper config is not defined in context

## Render Prop Types

The following types define the props passed to render functions in various components:

### `UploadZoneChildProps`

Props passed to the render function of `UploadImages.Zone` component.

**Properties:**

- `isDragActive: boolean` - True when files are being dragged over the drop zone
- `isFileDialogActive: boolean` - True when the native file dialog is open
- `isFocused: boolean` - True when the drop zone is focused (keyboard navigation)

### `UploadFilesChildProps`

Props passed to the render function of `UploadImages.Files` component.

**Properties:**

- `files?: FileWithId[]` - Array of currently uploaded files with unique IDs

### `UploadFileItemChildProps`

Props passed to the render function of `UploadImages.File` component.

**Properties:**

- `file: FileWithId` - The file object containing the original File and unique ID
- `preview?: string` - Base64 data URL of the image preview (undefined while loading)
- `remove: () => void` - Function to remove this file from the upload list

### `UploadImagesCropperEditorChildProps`

Props passed to the render function of `UploadImages.Cropper` component.

**Properties:**

- `zoom: number` - Current zoom level (1.0 = no zoom)
- `rotation: number` - Current rotation angle in degrees
- `setZoom: (zoom: number) => void` - Function to update zoom level
- `setRotation: (rotation: number) => void` - Function to update rotation angle
- `accept: () => void` - Function to accept the current crop and add to files
- `close: () => void` - Function to cancel cropping and close the editor

## Usage Examples

### Basic Upload

```typescript
import { useState } from "react";
import { UploadImages, useUploadImages, FileWithId } from "@leancodepl/image-uploader";

function BasicUpload() {
  const [files, setFiles] = useState<FileWithId[]>([]);

  const uploader = useUploadImages({
    value: files,
    onChange: setFiles,
    onError: (error) => console.error("Upload error:", error),
    accept: { "image/*": [".jpg", ".png", ".gif"] }
  });

  return (
    <UploadImages.Root uploader={uploader}>
      <UploadImages.Zone>
        {({ isDragActive }) => (
          <div>
            {isDragActive ? "Drop files here" : "Click or drag files to upload"}
          </div>
        )}
      </UploadImages.Zone>

      <UploadImages.Files>
        {({ files }) => (
          <div>
            {files?.map(file => (
              <UploadImages.File key={file.id} file={file}>
                {({ preview, remove }) => (
                  <div>
                    <img src={preview} alt="Preview" />
                    <p>{file.originalFile.name}</p>
                    <button onClick={remove}>Remove</button>
                  </div>
                )}
              </UploadImages.File>
            ))}
          </div>
        )}
      </UploadImages.Files>
    </UploadImages.Root>
  );
}
```

### Server Upload Integration

```typescript
import { tryUploadWithUploadParams } from "@leancodepl/image-uploader"

async function uploadToServer(image: FileWithId) {
  try {
    const uploadedImage = await tryUploadWithUploadParams(image, async img => {
      // Get upload URL from your API
      const response = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: img.originalFile.name,
          fileType: img.originalFile.type,
        }),
      })

      const { uploadUrl, headers } = await response.json()

      return {
        uri: uploadUrl,
        method: "PUT",
        requiredHeaders: headers,
      }
    })

    console.log("Upload successful:", uploadedImage.url)
    return uploadedImage
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}
```

### Error Handling

```typescript
import { ErrorCode } from "@leancodepl/image-uploader"

function handleUploadError(errorCode: ErrorCode) {
  switch (errorCode) {
    case ErrorCode.FileTooLarge:
      alert("File is too large. Please choose a smaller file.")
      break
    case ErrorCode.FileInvalidType:
      alert("Invalid file type. Please upload an image file.")
      break
    case ErrorCode.TooManyFiles:
      alert("Too many files selected. Please choose fewer files.")
      break
    default:
      alert("An error occurred while uploading the file.")
  }
}

const uploader = useUploadImages({
  value: files,
  onChange: setFiles,
  onError: handleUploadError,
})
```

## Features

- **Drag-and-Drop Support**: Built on `"react-dropzone"` for intuitive file selection
- **Image Cropping**: Optional cropping with zoom and rotation using `"react-easy-crop"`
- **File Validation**: Automatic validation with customizable error handling
- **Preview Generation**: Automatic image preview generation for uploaded files
- **Duplicate Detection**: Prevents uploading the same file multiple times
- **TypeScript Support**: Full TypeScript definitions included
- **Flexible UI**: Render prop pattern for complete UI customization
- **Server Integration**: Helper utilities for uploading to any backend service

## Configuration

### Cropper Configuration

```typescript
type CropperConfig = {
  aspect: number // Aspect ratio (e.g., 16/9, 1, 4/3)
  maxWidth?: number // Maximum output width in pixels
  maxHeight?: number // Maximum output height in pixels
  withRotation?: boolean // Enable rotation controls
  withZoom?: boolean // Enable zoom controls
}
```

### File Accept Types

```typescript
// Accept only JPEG and PNG
const accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
}

// Accept all image types (default)
const accept = { "image/*": [] }
```

### Upload with Cropping

```typescript
import { useState } from "react";
import { UploadImages, useUploadImages, FileWithId } from "@leancodepl/image-uploader";

function CroppableUpload() {
  const [files, setFiles] = useState<FileWithId[]>([]);

  const uploader = useUploadImages({
    value: files,
    onChange: setFiles,
    cropper: {
      aspect: 16 / 9,
      maxWidth: 800,
      maxHeight: 450,
      withRotation: true,
      withZoom: true
    }
  });

  return (
    <UploadImages.Root uploader={uploader}>
      <UploadImages.Zone>
        Drop images to crop
      </UploadImages.Zone>

      <UploadImages.Cropper>
        {({ zoom, rotation, setZoom, setRotation, accept, close }) => (
          <div>
            <UploadImages.CropperEditor />
            <div>
              <label>
                Zoom: <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </label>
              <label>
                Rotation: <input
                  type="range"
                  min={-180}
                  max={180}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                />
              </label>
              <div>
                <button onClick={accept}>Accept</button>
                <button onClick={close}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </UploadImages.Cropper>

      <UploadImages.Files>
        {({ files }) => (
          <div>
            {files?.map(file => (
              <UploadImages.File key={file.id} file={file}>
                {({ preview, remove }) => (
                  <div>
                    <img src={preview} alt="Cropped" />
                    <button onClick={remove}>Remove</button>
                  </div>
                )}
              </UploadImages.File>
            ))}
          </div>
        )}
      </UploadImages.Files>
    </UploadImages.Root>
  );
}
```

### Server Upload Integration

```typescript
import { tryUploadWithUploadParams } from "@leancodepl/image-uploader"

async function uploadToServer(image: FileWithId) {
  try {
    const uploadedImage = await tryUploadWithUploadParams(image, async img => {
      // Get upload URL from your API
      const response = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: img.originalFile.name,
          fileType: img.originalFile.type,
        }),
      })

      const { uploadUrl, headers } = await response.json()

      return {
        uri: uploadUrl,
        method: "PUT",
        requiredHeaders: headers,
      }
    })

    console.log("Upload successful:", uploadedImage.url)
    return uploadedImage
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}
```

### Error Handling

```typescript
import { ErrorCode } from "@leancodepl/image-uploader"

function handleUploadError(errorCode: ErrorCode) {
  switch (errorCode) {
    case ErrorCode.FileTooLarge:
      alert("File is too large. Please choose a smaller file.")
      break
    case ErrorCode.FileInvalidType:
      alert("Invalid file type. Please upload an image file.")
      break
    case ErrorCode.TooManyFiles:
      alert("Too many files selected. Please choose fewer files.")
      break
    default:
      alert("An error occurred while uploading the file.")
  }
}

const uploader = useUploadImages({
  value: files,
  onChange: setFiles,
  onError: handleUploadError,
})
```

## Features

- **Drag-and-Drop Support**: Built on `"react-dropzone"` for intuitive file selection
- **Image Cropping**: Optional cropping with zoom and rotation using `"react-easy-crop"`
- **File Validation**: Automatic validation with customizable error handling
- **Preview Generation**: Automatic image preview generation for uploaded files
- **Duplicate Detection**: Prevents uploading the same file multiple times
- **TypeScript Support**: Full TypeScript definitions included
- **Flexible UI**: Render prop pattern for complete UI customization
- **Server Integration**: Helper utilities for uploading to any backend service

## Configuration

### Cropper Configuration

```typescript
type CropperConfig = {
  aspect: number // Aspect ratio (e.g., 16/9, 1, 4/3)
  maxWidth?: number // Maximum output width in pixels
  maxHeight?: number // Maximum output height in pixels
  withRotation?: boolean // Enable rotation controls
  withZoom?: boolean // Enable zoom controls
}
```

### File Accept Types

```typescript
// Accept only JPEG and PNG
const accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
}

// Accept all image types (default)
const accept = { "image/*": [] }
```
