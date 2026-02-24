export function defaultIsVersionCompatible(hostVersion: string, remoteVersion: string): boolean {
  try {
    const [hMajor] = hostVersion.split(".").map(Number)
    const [rMajor] = remoteVersion.split(".").map(Number)
    return !Number.isNaN(hMajor) && !Number.isNaN(rMajor) && hMajor === rMajor
  } catch {
    return false
  }
}
