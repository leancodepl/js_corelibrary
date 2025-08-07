export function findCommonPathsPrefix(paths: string[][]): string[] {
  if (paths.length === 0) return []
  if (paths.length === 1) return paths[0]

  const commonPrefix: string[] = []
  const minLength = Math.min(...paths.map(path => path.length))

  for (let i = 0; i < minLength; i++) {
    const segment = paths[0][i]
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
