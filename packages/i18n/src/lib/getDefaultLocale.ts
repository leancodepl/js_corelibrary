export function getDefaultLocale<TSupportedLocale extends string, TFallbackLocale extends TSupportedLocale>(
    supportedLocales: TSupportedLocale[],
    fallbackLocale?: TFallbackLocale,
): TSupportedLocale;
export function getDefaultLocale(): string;
export function getDefaultLocale(supportedLocales?: string[], fallbackLocale?: string) {
    const navigatorLocale = navigator.language.split("-")[0].toLowerCase();

    if (supportedLocales) {
        if (supportedLocales.includes(navigatorLocale)) {
            return navigatorLocale;
        }

        if (fallbackLocale) {
            return fallbackLocale;
        }

        throw new Error(`Navigator locale (${navigatorLocale}) is not supported`);
    }

    return navigatorLocale;
}
