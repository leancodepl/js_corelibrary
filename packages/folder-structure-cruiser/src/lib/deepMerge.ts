function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * True for plain objects only — excludes arrays and functions, mirroring the
 * runtime `isPlainObject` guard so the type recurses exactly where the value
 * does.
 */
type IsPlainObject<T> = T extends readonly unknown[]
  ? false
  : T extends (...args: never[]) => unknown
    ? false
    : T extends object
      ? true
      : false

/**
 * Result of {@link deepMerge}: keys present only in `target` or only in
 * `source` are carried over as-is, keys in both are taken from `source` unless
 * both sides are plain objects, in which case they merge recursively.
 */
type DeepMerge<T, T2> = {
  [K in keyof T | keyof T2]: K extends keyof T2
    ? K extends keyof T
      ? IsPlainObject<T[K]> extends true
        ? IsPlainObject<T2[K]> extends true
          ? DeepMerge<T[K], T2[K]>
          : T2[K]
        : T2[K]
      : T2[K]
    : K extends keyof T
      ? T[K]
      : never
}

/**
 * Recursive object merge: nested plain objects merge key by key, while arrays
 * and scalars from `source` replace the value in `target` outright. Used for
 * the `dependencyCruiserOptions` escape hatch, where the user's options layer
 * on top of the built-in ones.
 */
export function deepMerge<T extends object, T2 extends object>(target: T, source: T2): DeepMerge<T, T2> {
  const result: Record<string, unknown> = { ...(target as Record<string, unknown>) }

  for (const [key, value] of Object.entries(source)) {
    // Guard against prototype-polluting keys: a JSON config can carry an
    // own-enumerable `__proto__`/`constructor`, and assigning through them
    // would mutate the prototype instead of producing an own property.
    if (key === "__proto__" || key === "constructor") {
      continue
    }

    const existing = result[key]
    result[key] = isPlainObject(existing) && isPlainObject(value) ? deepMerge(existing, value) : value
  }

  return result as DeepMerge<T, T2>
}
