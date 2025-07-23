declare global {
    interface ImportMeta {
        env: Record<`VITE_${string}`, string | undefined>
    }
}

export function mkGetInjectedConfig<TConfigKey extends string>() {
    return {
        getInjectedConfig: (key: TConfigKey) => import.meta.env[`VITE_${key}`] as string | undefined,
    }
}
