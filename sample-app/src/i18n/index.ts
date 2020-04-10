import mkI18n, { getDefaultLocale } from "@leancode/i18n";

type TTerm = keyof typeof import("./en.json") | keyof typeof import("./pl.json");

export const { Localize, Provider: I18nProvider, changeLocale, intl, useIntl } = mkI18n<"en" | "pl", TTerm>(
    {
        en: () => import(/* webpackChunkName: "en.json" */ "./en.json").then(d => d.default),
        pl: () => import(/* webpackChunkName: "pl.json" */ "./pl.json").then(d => d.default),
    },
    getDefaultLocale(["en", "pl"], "en"),
);
