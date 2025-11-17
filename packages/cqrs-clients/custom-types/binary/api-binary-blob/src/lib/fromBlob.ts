import { ApiBinary, fromRaw } from "@leancodepl/api-binary"

/**
 * Converts Blob to ApiBinary asynchronously.
 *
 * Reads the Blob content as base64 data URL and converts it to ApiBinary format.
 * Handles both required and optional blob parameters with proper overloads.
 *
 * @param blob - The Blob to convert to ApiBinary
 * @returns Promise resolving to ApiBinary or undefined if blob is undefined
 * @example
 * ```typescript
 * const file = new File(['hello world'], 'test.txt', { type: 'text/plain' });
 * const binary = await fromBlob(file);
 * ```
 */
export function fromBlob(blob: Blob): Promise<ApiBinary>
export function fromBlob(blob?: Blob): Promise<ApiBinary | undefined>
export function fromBlob(blob?: Blob) {
  if (!blob) return Promise.resolve(undefined)

  return new Promise<ApiBinary>((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        if (typeof result === "string") {
          // we need to strip the `data:*/*;base64,` from the beginning
          resolve(fromRaw(result.substring(1 + result.indexOf(",", result.indexOf(";")))))
          return
        }

        throw new Error("Unknown blob result received for ApiBinary creation")
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    } catch (e) {
      reject(e)
    }
  })
}
