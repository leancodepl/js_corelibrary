import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createIntl, createIntlCache, FormattedMessage, IntlShape, RawIntlProvider, useIntl } from "react-intl";

type FormattedMessageProps = import("react-intl/dist/components/message").Props;

const localeChangedEvent = "LocaleChanged";

export function getDefaultLocale<TSupportedLocale extends string>(
    supportedLanguages: TSupportedLocale[],
    fallbackLanguage?: TSupportedLocale,
): TSupportedLocale;
export function getDefaultLocale(): string;
export function getDefaultLocale(supportedLocales?: string[], fallbackLocale?: string) {
    const navigatorLocale = navigator.language.substr(0, 2).toLowerCase();

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

declare global {
    interface Window {
        currentLocale?: string;
    }
}

export default function mkI18n<TSupportedLocale extends string, TTerm extends string>(
    locales: Record<TSupportedLocale, () => Promise<Record<TTerm, string>>>,
    defaultLocale: TSupportedLocale,
) {
    window.currentLocale = defaultLocale;

    const cache = createIntlCache();

    const messagesCache: Partial<{ [TKey in TSupportedLocale]: Record<TTerm, string> }> = {};

    return {
        Localize: (props: FormattedMessageProps & { id: TTerm }) => <FormattedMessage {...props} />,
        useIntl: useIntl as () => IntlShape & { messages: Record<TTerm, string> },
        Provider({ children }: { children?: ReactNode }) {
            const [currentLocale, setCurrentLocale] = useState<TSupportedLocale>(
                () => window.currentLocale! as TSupportedLocale,
            );

            const currentLocaleRef = useRef(currentLocale);

            const [intl, setIntl] = useState(() =>
                createIntl(
                    {
                        locale: currentLocale!,
                        messages: messagesCache[currentLocale!],
                    },
                    cache,
                ),
            );

            useEffect(() => {
                const handler = () => {
                    setCurrentLocale(window.currentLocale as TSupportedLocale);
                    currentLocaleRef.current = window.currentLocale as TSupportedLocale;
                };

                window.addEventListener(localeChangedEvent, handler);

                return () => window.removeEventListener(localeChangedEvent, handler);
            }, []);

            useEffect(() => {
                const cachedMessages = messagesCache[currentLocale];

                if (cachedMessages) {
                    setIntl(
                        createIntl(
                            {
                                locale: currentLocale!,
                                messages: cachedMessages,
                            },
                            cache,
                        ),
                    );
                    return;
                }

                (async () => {
                    const messages = await locales[currentLocale]();

                    messagesCache[currentLocale] = messages;

                    if (currentLocaleRef.current === currentLocale) {
                        setIntl(
                            createIntl(
                                {
                                    locale: currentLocale!,
                                    messages,
                                },
                                cache,
                            ),
                        );
                    }
                })();
            }, [currentLocale]);

            return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
        },
        changeLocale(locale: TSupportedLocale) {
            window.currentLocale = locale;
            window.dispatchEvent(new Event(localeChangedEvent));
        },
    };
}
