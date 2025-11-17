declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var app_config:
    | {
        readonly NX_AUTH_BASE: string
        readonly NX_SHOW_DEV_TOOLS: string
      }
    | undefined
}

export const environment = {
  authUrl: globalThis.app_config?.NX_AUTH_BASE ?? import.meta.env["VITE_AUTH_BASE"],
  showDevTools: (globalThis.app_config?.NX_SHOW_DEV_TOOLS ?? import.meta.env["VITE_SHOW_DEV_TOOLS"]) === "true",
}
