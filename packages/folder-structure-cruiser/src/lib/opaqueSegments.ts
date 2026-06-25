/**
 * A directory whose name ends with a single underscore (e.g. `features_`) is
 * opaque: a transparent container that doesn't count toward the folder
 * structure depth.
 *
 * The single-trailing-underscore rule deliberately spares names like
 * `__tests__`, where the trailing underscore is part of the convention rather
 * than an opacity marker.
 */
export function isOpaqueSegment(segment: string): boolean {
  return /[^_]_$/.test(segment)
}

export function stripOpaqueSegments(segments: string[]): string[] {
  return segments.filter(segment => !isOpaqueSegment(segment))
}
