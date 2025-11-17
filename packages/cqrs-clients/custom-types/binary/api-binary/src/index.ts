export type ApiBinaryRaw = string

class _ApiBinary {
  private _!: never
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApiBinary extends _ApiBinary {}

/**
 * Converts ApiBinary to raw string representation.
 *
 * Transforms the ApiBinary type to its underlying string representation
 * for serialization or API communication.
 *
 * @param apiBinary - The ApiBinary value to convert
 * @returns Raw string representation of the binary data
 * @example
 * ```typescript
 * const binary = fromRaw('SGVsbG8gV29ybGQ=');
 * const raw = toRaw(binary);
 * ```
 */
export function toRaw(apiBinary: ApiBinary) {
  return apiBinary as unknown as ApiBinaryRaw
}

/**
 * Converts raw string to ApiBinary type.
 *
 * Transforms a raw string representation to the ApiBinary type
 * for type-safe handling of binary data in the application.
 *
 * @param apiBinaryRaw - The raw string representation to convert
 * @returns ApiBinary instance from the raw string
 * @example
 * ```typescript
 * const binary = fromRaw('SGVsbG8gV29ybGQ=');
 * ```
 */
export function fromRaw(apiBinaryRaw: ApiBinaryRaw) {
  return apiBinaryRaw as unknown as ApiBinary
}
