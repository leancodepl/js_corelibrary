declare global {
    // eslint-disable-next-line no-var
    var app_config:
        | {
              readonly NX_AUTH_BASE: string
          }
        | undefined
}

export const environment = {
    authUrl: globalThis.app_config?.NX_AUTH_BASE ?? import.meta.env.VITE_AUTH_BASE,
}
