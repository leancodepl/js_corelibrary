export function mergeWithEnv<T extends { poeditorApiToken?: string; poeditorProjectId?: number }>(
  options: T,
): T & { poeditorApiToken?: string; poeditorProjectId?: number } {
  const poeditorApiToken = options.poeditorApiToken || process.env["POEDITOR_API_TOKEN"]
  const poeditorProjectId =
    options.poeditorProjectId ||
    (process.env["POEDITOR_PROJECT_ID"] ? Number.parseInt(process.env["POEDITOR_PROJECT_ID"], 10) : undefined)

  return {
    ...options,
    poeditorApiToken,
    poeditorProjectId,
  }
}
