declare global {
  interface ImportMetaEnv {
    [key: `VITE_${string}`]: string | undefined
  }
}

/**
 * Creates a getter function for accessing Vite-injected configuration values from environment variables on development,
 * on production it will return the value from the environment variables.
 * You can check leancodepl/tools repository for more information. There's nginx-base defined which parses it out.
 *
 * The keys are automatically prefixed with 'VITE_' when accessing import.meta.env.
 *
 * @template TConfigKey - The string type for configuration keys.
 * @returns An object containing the `getInjectedConfig` method.
 * @example
 * ```typescript
 * const { getInjectedConfig } = mkGetInjectedConfig<'API_URL' | 'API_KEY'>();
 * const apiUrl = getInjectedConfig('API_URL');
 * ```
 */
export function mkGetInjectedConfig<TConfigKey extends string>() {
  return {
    getInjectedConfig: (key: TConfigKey) => import.meta.env[`VITE_${key}`] as string | undefined,
  }
}
