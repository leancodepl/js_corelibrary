/**
 * Finds the common prefix among multiple path arrays
 */
export function findCommonPathsPrefix(paths: string[][]): string[] {
  return paths.reduce((common, current) => {
    const minLength = Math.min(common.length, current.length)
    const matchIndex = common.findIndex((part, index) => index >= minLength || part !== current[index])
    return common.slice(0, matchIndex === -1 ? minLength : matchIndex)
  })
}

export function findCommonPathsPrefixLength(paths: string[][]): number {
  return findCommonPathsPrefix(paths).length
}
