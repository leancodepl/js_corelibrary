export function findCommonPathsPrefix(paths: string[][]): string[] {
  const [firstPath, ...restPaths] = paths
  if (!firstPath) return []
  if (restPaths.length === 0) return firstPath

  const commonPrefix: string[] = []
  const minLength = Math.min(...paths.map(path => path.length))

  for (let i = 0; i < minLength; i++) {
    const segment = firstPath[i]
    if (segment === undefined) break
    if (paths.every(path => path[i] === segment)) {
      commonPrefix.push(segment)
    } else {
      break
    }
  }

  return commonPrefix
}

export function findCommonPathsPrefixLength(paths: string[][]): number {
  return findCommonPathsPrefix(paths).length
}
