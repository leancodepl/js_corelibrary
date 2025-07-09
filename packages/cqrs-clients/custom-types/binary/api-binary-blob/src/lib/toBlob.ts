import { ApiBinary, toRaw } from "@leancodepl/api-binary"
import { base64toBlob } from "./base64ToBlob"

/**
 * Converts ApiBinary to Blob with optional content type.
 * 
 * Transforms ApiBinary base64 data to a Blob object for file operations.
 * Supports both required and optional parameters.
 * 
 * @param apiBinary - The ApiBinary to convert to Blob
 * @param contentType - Optional MIME type for the Blob
 * @returns Blob instance or undefined if apiBinary is null/undefined
 * @example
 * ```typescript
 * const blob = toBlob(binary, 'image/jpeg');
 * const url = URL.createObjectURL(blob);
 * ```
 */
export function toBlob(apiBinary: ApiBinary, contentType?: string): Blob
export function toBlob(apiBinary?: ApiBinary | null, contentType?: string): Blob | undefined
export function toBlob(apiBinary?: ApiBinary | null, contentType?: string) {
    if (apiBinary === undefined || apiBinary === null) {
        return undefined
    }

    return base64toBlob(toRaw(apiBinary), contentType)
}
